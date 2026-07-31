<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface UtilityCatalogItem {
  name: string
  family: string
  declaration: string
}

interface UtilityCatalogRow extends UtilityCatalogItem {
  aliases: string[]
  breakpoints: string[]
  displayName: string
  hasBase: boolean
  key: string
  pattern?: string
}

const breakpointOrder = ['sm', 'md', 'lg', 'xl', 'xxl']

const catalogLoaders = {
  all: () => import('../generated/utilities-catalog.json'),
  display: () => import('../generated/utility-catalogs/display.json'),
  flex: () => import('../generated/utility-catalogs/flex.json'),
  spacing: () => import('../generated/utility-catalogs/spacing.json'),
  overflow: () => import('../generated/utility-catalogs/overflow.json'),
  borders: () => import('../generated/utility-catalogs/borders.json'),
  typography: () => import('../generated/utility-catalogs/typography.json'),
  'position-float': () => import('../generated/utility-catalogs/position-float.json'),
  sizing: () => import('../generated/utility-catalogs/sizing.json'),
  'cursor-opacity': () => import('../generated/utility-catalogs/cursor-opacity.json'),
  helpers: () => import('../generated/utility-catalogs/helpers.json'),
  elevation: () => import('../generated/utility-catalogs/elevation.json'),
  'theme-colors': () => import('../generated/utility-catalogs/theme-colors.json'),
}

const props = withDefaults(
  defineProps<{
    section?: keyof typeof catalogLoaders
    initialLimit?: number
  }>(),
  {
    section: 'all',
    initialLimit: 180,
  },
)

const classes = ref<UtilityCatalogItem[]>([])
const loading = ref(true)
const query = ref('')
const selectedFamily = ref('all')
const showAll = ref(false)

const rows = computed<UtilityCatalogRow[]>(() => {
  const grouped = new Map<string, UtilityCatalogRow>()

  for (const item of classes.value) {
    const responsive = item.name.match(/^(.*)-(sm|md|lg|xl|xxl)(-.+)$/)
    const baseName = responsive ? `${responsive[1]}${responsive[3]}` : item.name
    const key = `${item.family}\u0000${item.declaration}\u0000${baseName}`
    const current = grouped.get(key) ?? {
      ...item,
      aliases: [],
      breakpoints: [],
      displayName: baseName,
      hasBase: false,
      key,
    }

    current.aliases.push(item.name)
    if (responsive) {
      current.pattern = `${responsive[1]}-{breakpoint}${responsive[3]}`
      current.breakpoints.push(responsive[2])
    } else {
      current.hasBase = true
    }
    grouped.set(key, current)
  }

  return [...grouped.values()].map((item) => ({
    ...item,
    breakpoints: breakpointOrder.filter((breakpoint) => item.breakpoints.includes(breakpoint)),
    displayName: item.pattern ? `${item.hasBase ? `${item.name} / ` : ''}${item.pattern}` : item.name,
  }))
})
const familyOptions = computed(() => [...new Set(rows.value.map((item) => item.family))])
const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return rows.value.filter(
    (item) =>
      (selectedFamily.value === 'all' || item.family === selectedFamily.value) &&
      (!needle ||
        [item.displayName, item.family, item.declaration, ...item.aliases].join(' ').toLowerCase().includes(needle)),
  )
})
const visible = computed(() => (showAll.value ? filtered.value : filtered.value.slice(0, props.initialLimit)))

onMounted(async () => {
  const module = await catalogLoaders[props.section]()
  classes.value = module.default.classes as UtilityCatalogItem[]
  loading.value = false
})
</script>

<template>
  <div class="mc-utility-catalog">
    <p v-if="loading">正在加载本章类名…</p>
    <div v-else class="mc-utility-catalog__toolbar">
      <label>
        搜索本章类名
        <input v-model="query" type="search" placeholder="输入类名或 CSS 声明" @input="showAll = false" />
      </label>
      <label v-if="familyOptions.length > 1">
        工具族
        <select v-model="selectedFamily" @change="showAll = false">
          <option value="all">全部</option>
          <option v-for="item in familyOptions" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
    </div>

    <p v-if="!loading">
      显示 {{ visible.length }} / {{ filtered.length }} 组匹配写法；本章 {{ classes.length }} 个具体类汇总为
      {{ rows.length }} 组。
    </p>
    <div v-if="!loading" class="mc-utility-catalog__table-wrap">
      <table>
        <thead>
          <tr>
            <th>类名写法</th>
            <th>工具族</th>
            <th>声明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in visible" :key="item.key">
            <td>
              <code>{{ item.displayName }}</code>
              <small v-if="item.breakpoints.length" class="mc-utility-catalog__breakpoints">
                {{ item.hasBase ? '基础及' : '' }}{{ item.breakpoints.join(' / ') }} 断点
              </small>
            </td>
            <td>{{ item.family }}</td>
            <td>{{ item.declaration }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      v-if="!loading && visible.length < filtered.length"
      class="mc-utility-catalog__more"
      type="button"
      @click="showAll = true"
    >
      显示全部 {{ filtered.length }} 个匹配类名
    </button>
  </div>
</template>

<style scoped>
.mc-utility-catalog {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}
.mc-utility-catalog__toolbar {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.mc-utility-catalog label {
  display: grid;
  gap: 5px;
  font-weight: 600;
}
.mc-utility-catalog input,
.mc-utility-catalog select {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  box-sizing: border-box;
  min-height: 38px;
  padding: 6px 9px;
}
.mc-utility-catalog__table-wrap {
  max-height: 620px;
  overflow: auto;
}
.mc-utility-catalog table {
  display: table;
  margin: 0;
  width: 100%;
}
.mc-utility-catalog th,
.mc-utility-catalog td {
  min-width: 140px;
  text-align: start;
  vertical-align: top;
}
.mc-utility-catalog th:first-child,
.mc-utility-catalog td:first-child {
  min-width: 190px;
}
.mc-utility-catalog code {
  overflow-wrap: anywhere;
  white-space: normal;
}
.mc-utility-catalog__breakpoints {
  color: var(--vp-c-text-2);
  display: block;
  margin-top: 5px;
}
.mc-utility-catalog__more {
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  justify-self: start;
  padding: 7px 12px;
}
</style>
