<script setup lang="ts">
import '../../styles/component-core.css'
import './style.css'
import { computed, ref, useSlots, watch } from 'vue'
import { useMcLocale } from '../../framework/locale'
import McPagination from '../McPagination'
import McTable from '../McTable'

export interface McDataTableHeader {
  title: string
  key: string
  sortable?: boolean
  align?: 'start' | 'center' | 'end'
  width?: number | string
}
export interface McDataTableSort {
  key: string
  order: 'asc' | 'desc'
}
export interface McDataTableOptions {
  page: number
  itemsPerPage: number
  sortBy: McDataTableSort[]
  search: string
}
export type McDataTableItem = Record<string, unknown>

const defaultOptions = (): McDataTableOptions => ({ page: 1, itemsPerPage: 10, sortBy: [], search: '' })
const props = withDefaults(
  defineProps<{
    headers: McDataTableHeader[]
    items: McDataTableItem[]
    options?: McDataTableOptions
    itemKey?: string | ((item: McDataTableItem) => unknown)
    itemsPerPageOptions?: number[]
    mode?: 'client' | 'server'
    itemsLength?: number
    loading?: boolean
    noDataText?: string
    showSelect?: boolean
    modelValue?: unknown[]
    multiSort?: boolean
  }>(),
  {
    options: () => ({ page: 1, itemsPerPage: 10, sortBy: [], search: '' }),
    itemKey: 'id',
    itemsPerPageOptions: () => [10, 25, 50, 100],
    mode: 'client',
    itemsLength: 0,
    loading: false,
    showSelect: false,
    modelValue: () => [],
    multiSort: false,
  },
)
const emit = defineEmits<{
  (event: 'update:options', value: McDataTableOptions): void
  (event: 'update:modelValue', value: unknown[]): void
  (event: 'change', value: unknown[]): void
}>()

const locale = useMcLocale()
const slots = useSlots()
const normalizeOptions = (value?: McDataTableOptions): McDataTableOptions => ({
  ...defaultOptions(),
  ...value,
  page: Math.max(1, Math.trunc(value?.page ?? 1)),
  itemsPerPage: Math.max(1, Math.trunc(value?.itemsPerPage ?? 10)),
  sortBy: [...(value?.sortBy ?? [])],
  search: value?.search ?? '',
})
const localOptions = ref(normalizeOptions(props.options))

watch(
  () => props.options,
  (value) => {
    localOptions.value = normalizeOptions(value)
  },
  { deep: true },
)

const keyOf = (item: McDataTableItem) =>
  typeof props.itemKey === 'function' ? props.itemKey(item) : item[props.itemKey]
const normalizedSearch = computed(() => localOptions.value.search.trim().toLocaleLowerCase())
const filtered = computed(() =>
  props.mode === 'server' || !normalizedSearch.value
    ? props.items
    : props.items.filter((item) =>
        props.headers.some((header) =>
          String(item[header.key] ?? '')
            .toLocaleLowerCase()
            .includes(normalizedSearch.value),
        ),
      ),
)
const sorted = computed(() => {
  if (props.mode === 'server' || !localOptions.value.sortBy.length) return filtered.value
  return filtered.value
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      for (const sort of localOptions.value.sortBy) {
        const left = a.item[sort.key]
        const right = b.item[sort.key]
        const comparison =
          typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left ?? '').localeCompare(String(right ?? ''))
        if (comparison) return sort.order === 'asc' ? comparison : -comparison
      }
      return a.index - b.index
    })
    .map((entry) => entry.item)
})
const totalItems = computed(() => (props.mode === 'server' ? props.itemsLength : sorted.value.length))
const pageCount = computed(() => Math.max(1, Math.ceil(totalItems.value / localOptions.value.itemsPerPage)))
const displayed = computed(() =>
  props.mode === 'server'
    ? props.items
    : sorted.value.slice(
        (localOptions.value.page - 1) * localOptions.value.itemsPerPage,
        localOptions.value.page * localOptions.value.itemsPerPage,
      ),
)
const allDisplayedSelected = computed(
  () =>
    displayed.value.length > 0 &&
    displayed.value.every((item) => props.modelValue.some((value) => Object.is(value, keyOf(item)))),
)

function updateOptions(patch: Partial<McDataTableOptions>) {
  const next = normalizeOptions({ ...localOptions.value, ...patch })
  localOptions.value = next
  emit('update:options', next)
}
function updatePage(value: number) {
  updateOptions({ page: value })
}
function updateItemsPerPage(value: number) {
  updateOptions({ itemsPerPage: value, page: 1 })
}
function toggleSort(header: McDataTableHeader) {
  if (header.sortable === false) return
  const current = localOptions.value.sortBy.find((sort) => sort.key === header.key)
  const next = props.multiSort ? localOptions.value.sortBy.filter((sort) => sort.key !== header.key) : []
  if (!current) next.push({ key: header.key, order: 'asc' })
  else if (current.order === 'asc') next.push({ key: header.key, order: 'desc' })
  updateOptions({ sortBy: next })
}
function updateSelection(value: unknown[]) {
  emit('update:modelValue', value)
  emit('change', value)
}
function toggle(item: McDataTableItem) {
  const key = keyOf(item)
  const selected = props.modelValue.some((value) => Object.is(value, key))
  updateSelection(selected ? props.modelValue.filter((value) => !Object.is(value, key)) : [...props.modelValue, key])
}
function toggleAll() {
  const keys = displayed.value.map(keyOf)
  updateSelection(
    allDisplayedSelected.value
      ? props.modelValue.filter((value) => !keys.some((key) => Object.is(key, value)))
      : [...new Set([...props.modelValue, ...keys])],
  )
}
watch(pageCount, (count) => {
  if (localOptions.value.page > count) updateOptions({ page: count })
})
</script>

<template>
  <div class="mc-data-table" :aria-busy="loading || undefined">
    <mc-table hover>
      <template #header
        ><tr>
          <th v-if="showSelect" class="mc-data-table__select">
            <input
              type="checkbox"
              :checked="allDisplayedSelected"
              :aria-label="locale.t('selectAll')"
              @change="toggleAll"
            />
          </th>
          <th
            v-for="header in headers"
            :key="header.key"
            :class="`mc-data-table__cell--${header.align || 'start'}`"
            :style="{ width: typeof header.width === 'number' ? `${header.width}px` : header.width }"
            :aria-sort="
              localOptions.sortBy.find((sort) => sort.key === header.key)?.order === 'asc'
                ? 'ascending'
                : localOptions.sortBy.find((sort) => sort.key === header.key)?.order === 'desc'
                  ? 'descending'
                  : undefined
            "
          >
            <button
              v-if="header.sortable !== false"
              type="button"
              class="mc-data-table__sort"
              @click="toggleSort(header)"
            >
              {{ header.title
              }}<span aria-hidden="true">{{
                localOptions.sortBy.find((sort) => sort.key === header.key)?.order === 'asc'
                  ? '▲'
                  : localOptions.sortBy.find((sort) => sort.key === header.key)?.order === 'desc'
                    ? '▼'
                    : '◆'
              }}</span>
            </button>
            <span v-else>{{ header.title }}</span>
          </th>
        </tr></template
      >
      <template #body>
        <tr v-if="loading">
          <td :colspan="headers.length + (showSelect ? 1 : 0)" class="mc-data-table__state">
            <slot name="loading">{{ locale.t('loading') }}</slot>
          </td>
        </tr>
        <tr v-else-if="!displayed.length">
          <td :colspan="headers.length + (showSelect ? 1 : 0)" class="mc-data-table__state">
            <slot name="no-data">{{ noDataText || locale.t('noData') }}</slot>
          </td>
        </tr>
        <tr v-for="(item, index) in displayed" v-else :key="String(keyOf(item))">
          <td v-if="showSelect" class="mc-data-table__select">
            <input
              type="checkbox"
              :checked="modelValue.some((value) => Object.is(value, keyOf(item)))"
              :aria-label="String(keyOf(item))"
              @change="toggle(item)"
            />
          </td>
          <td v-for="header in headers" :key="header.key" :class="`mc-data-table__cell--${header.align || 'start'}`">
            <component
              :is="slots[`item.${header.key}`]"
              v-if="slots[`item.${header.key}`]"
              :item="item"
              :value="item[header.key]"
              :index="index"
            />
            <template v-else>{{ item[header.key] }}</template>
          </td>
        </tr>
      </template>
    </mc-table>
    <div class="mc-data-table__footer">
      <label
        >{{ locale.t('itemsPerPage') }}
        <select
          :value="localOptions.itemsPerPage"
          @change="updateItemsPerPage(Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="value in itemsPerPageOptions" :key="value" :value="value">{{ value }}</option>
        </select></label
      >
      <mc-pagination :model-value="localOptions.page" :length="pageCount" @update:model-value="updatePage" />
    </div>
  </div>
</template>
