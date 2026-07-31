<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onContentUpdated, type Header } from 'vitepress'

const props = withDefaults(
  defineProps<{
    headers: Header[]
    label?: string
  }>(),
  { label: '本页目录' },
)

interface OutlineItem {
  level: number
  title: string
  link: string
}

function flattenHeaders(headers: Header[]): OutlineItem[] {
  return headers.flatMap((header) => {
    const current = header.level === 2 || header.level === 3 ? [header] : []
    return [...current, ...flattenHeaders(header.children ?? [])]
  })
}

const items = computed(() => flattenHeaders(props.headers))
const activeLink = ref('')
let observer: IntersectionObserver | undefined

function headingFromLink(link: string): HTMLElement | null {
  if (typeof document === 'undefined' || !link.startsWith('#')) return null
  try {
    return document.getElementById(decodeURIComponent(link.slice(1)))
  } catch {
    return document.getElementById(link.slice(1))
  }
}

function updateActive(visibleLinks: Set<string>): void {
  const visible = items.value.find((item) => visibleLinks.has(item.link))
  if (visible) {
    activeLink.value = visible.link
    return
  }

  const above = items.value.filter((item) => (headingFromLink(item.link)?.getBoundingClientRect().top ?? 1) <= 88)
  activeLink.value = above.at(-1)?.link ?? items.value[0]?.link ?? ''
}

function connectObserver(): void {
  observer?.disconnect()
  observer = undefined
  activeLink.value = items.value[0]?.link ?? ''
  if (typeof IntersectionObserver === 'undefined') return

  const visibleLinks = new Set<string>()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = `#${entry.target.id}`
        if (entry.isIntersecting) visibleLinks.add(link)
        else visibleLinks.delete(link)
      }
      updateActive(visibleLinks)
    },
    { rootMargin: '-76px 0px -65% 0px', threshold: [0, 1] },
  )

  for (const item of items.value) {
    const heading = headingFromLink(item.link)
    if (heading) observer.observe(heading)
  }
}

onMounted(() => nextTick(connectObserver))
onContentUpdated(() => nextTick(connectObserver))
watch(items, () => nextTick(connectObserver))
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav v-if="items.length" class="mc-docs-outline" :aria-label="label">
    <div class="mc-docs-outline__title">{{ label }}</div>
    <ol class="mc-docs-outline__list">
      <li v-for="item in items" :key="item.link" :class="`level-${item.level}`">
        <a
          :href="item.link"
          :class="{ 'is-active': activeLink === item.link }"
          :aria-current="activeLink === item.link ? 'location' : undefined"
        >
          {{ item.title }}
        </a>
      </li>
    </ol>
  </nav>
</template>
