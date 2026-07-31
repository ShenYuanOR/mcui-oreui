<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { DocsSidebarNode } from './docs-navigation'

const props = defineProps<{
  nodes: DocsSidebarNode[]
  resolveHref: (link: string) => string
  root?: boolean
}>()

defineEmits<{ navigate: [] }>()

const openGroups = reactive<Record<string, boolean>>({})

function syncGroups(nodes: DocsSidebarNode[]): void {
  for (const node of nodes) {
    if (openGroups[node.id] === undefined) openGroups[node.id] = !node.collapsed
    if (node.containsActive) openGroups[node.id] = true
    syncGroups(node.children)
  }
}

watch(() => props.nodes, syncGroups, { deep: true, immediate: true })

function isOpen(node: DocsSidebarNode): boolean {
  return !node.collapsible || openGroups[node.id]
}

function toggle(node: DocsSidebarNode): void {
  openGroups[node.id] = !isOpen(node)
}
</script>

<template>
  <ul class="mc-docs-sidebar-tree" :class="{ 'mc-docs-sidebar-tree--root': root }">
    <li v-for="node in nodes" :key="node.id" class="mc-docs-sidebar-node">
      <div v-if="node.children.length" class="mc-docs-sidebar-group" :class="{ 'is-active': node.containsActive }">
        <button
          v-if="node.collapsible"
          type="button"
          class="mc-docs-sidebar-group__toggle"
          :aria-expanded="isOpen(node)"
          @click="toggle(node)"
        >
          <span>{{ node.text }}</span>
          <span class="mc-docs-sidebar-group__chevron" aria-hidden="true">▾</span>
        </button>
        <div v-else class="mc-docs-sidebar-group__label">{{ node.text }}</div>

        <DocsSidebarTree
          v-if="isOpen(node)"
          :nodes="node.children"
          :resolve-href="resolveHref"
          @navigate="$emit('navigate')"
        />
      </div>
      <a
        v-else-if="node.link"
        class="mc-docs-sidebar-link"
        :class="{ 'is-active': node.active }"
        :href="resolveHref(node.link)"
        :rel="node.rel"
        :target="node.target"
        :aria-current="node.active ? 'page' : undefined"
        @click="$emit('navigate')"
      >
        <span class="mc-docs-sidebar-link__pixel" aria-hidden="true" />
        <span>{{ node.text }}</span>
      </a>
      <div v-else class="mc-docs-sidebar-label">{{ node.text }}</div>
    </li>
  </ul>
</template>
