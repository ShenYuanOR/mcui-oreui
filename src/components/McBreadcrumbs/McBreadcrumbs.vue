<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, useAttrs } from 'vue'
import { useMcLocale } from '../../framework/locale'
export interface McBreadcrumbItem {
  title: string
  href?: string
  disabled?: boolean
}
defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{ items: McBreadcrumbItem[]; divider?: string }>(), { divider: '/' })
const locale = useMcLocale()
const attrs = useAttrs()
const accessibleLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : locale.t('breadcrumb'),
)
</script>

<template>
  <nav v-bind="attrs" class="mc-breadcrumbs" :aria-label="accessibleLabel">
    <ol class="mc-breadcrumbs__list">
      <li v-for="(item, index) in items" :key="`${item.title}-${index}`" class="mc-breadcrumbs__item">
        <span v-if="index" class="mc-breadcrumbs__divider" aria-hidden="true"
          ><slot name="divider">{{ divider }}</slot></span
        >
        <slot
          name="item"
          :item="item"
          :index="index"
          :props="{ href: item.href, 'aria-current': index === items.length - 1 ? 'page' : undefined }"
        >
          <span
            v-if="item.disabled || !item.href"
            :aria-current="index === items.length - 1 ? 'page' : undefined"
            :aria-disabled="item.disabled || undefined"
            >{{ item.title }}</span
          >
          <a v-else :href="item.href" :aria-current="index === items.length - 1 ? 'page' : undefined">{{
            item.title
          }}</a>
        </slot>
      </li>
    </ol>
  </nav>
</template>
