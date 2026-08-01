<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

type CodeTab = 'javascript' | 'html' | 'css'

const slots = useSlots()
const tabs = computed(() =>
  [
    { label: 'JS', value: 'javascript' as const },
    { label: 'HTML', value: 'html' as const },
    { label: 'CSS', value: 'css' as const },
  ].filter((item) => Boolean(slots[item.value])),
)
const panel = ref<string | null>(null)
const activeTab = ref<CodeTab>(tabs.value[0]?.value ?? 'html')
const languageSummary = computed(() => tabs.value.map((item) => item.label).join(' / '))
</script>

<template>
  <mc-expansion-panels v-model="panel" class="mc-docs-code-example">
    <mc-expansion-panel value="source">
      <template #title>
        <span class="mc-docs-code-example__summary">
          <span>示例代码</span>
          <span class="mc-docs-code-example__languages">{{ languageSummary }}</span>
        </span>
      </template>

      <mc-tabs v-model="activeTab" :items="tabs" class="mc-docs-code-example__tabs" activation="automatic">
        <template #default="{ active }">
          <div v-if="active === 'javascript'" class="mc-docs-code-example__pane"><slot name="javascript" /></div>
          <div v-else-if="active === 'html'" class="mc-docs-code-example__pane"><slot name="html" /></div>
          <div v-else class="mc-docs-code-example__pane"><slot name="css" /></div>
        </template>
      </mc-tabs>
    </mc-expansion-panel>
  </mc-expansion-panels>
</template>
