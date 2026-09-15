import { computed, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import { useMcService } from './fallback'
import type { McLocaleMessages, McLocaleOptions } from './types'

export const defaultMcMessages: Record<string, McLocaleMessages> = {
  'zh-CN': {
    close: '关闭',
    clear: '清除',
    open: '打开',
    noData: '暂无数据',
    noOptions: '没有可用选项',
    noMatches: '没有匹配选项',
    required: '此字段为必填项',
    invalid: '值无效',
    loading: '加载中',
    confirm: '确认',
    cancel: '取消',
    previous: '上一页',
    next: '下一页',
    first: '第一页',
    last: '最后一页',
    page: '第 {page} 页',
    itemsPerPage: '每页条数',
    search: '搜索',
    selectAll: '全选',
    fileDrop: '拖放文件到此处，或点击选择',
    fileType: '仅支持：{accept}',
    clearFiles: '清除文件',
    increment: '增加',
    decrement: '减少',
    pagination: '分页导航',
    breadcrumb: '面包屑',
    progress: '步骤进度',
    optional: '可选',
  },
  en: {
    close: 'Close',
    clear: 'Clear',
    open: 'Open',
    noData: 'No data available',
    noOptions: 'No options available',
    noMatches: 'No matching options',
    required: 'This field is required',
    invalid: 'Invalid value',
    loading: 'Loading',
    confirm: 'Confirm',
    cancel: 'Cancel',
    previous: 'Previous page',
    next: 'Next page',
    first: 'First page',
    last: 'Last page',
    page: 'Page {page}',
    itemsPerPage: 'Items per page',
    search: 'Search',
    selectAll: 'Select all',
    fileDrop: 'Drop files here, or click to browse',
    fileType: 'Only these types are allowed: {accept}',
    clearFiles: 'Clear files',
    increment: 'Increment',
    decrement: 'Decrement',
    pagination: 'Pagination',
    breadcrumb: 'Breadcrumb',
    progress: 'Step progress',
    optional: 'Optional',
  },
}

export interface McLocaleInstance {
  locale: Ref<string>
  fallback: string
  messages: Record<string, McLocaleMessages>
  isRtl: ComputedRef<boolean>
  dir: ComputedRef<'ltr' | 'rtl'>
  t: (key: string, params?: Record<string, string | number>) => string
  setLocale: (locale: string) => void
}

export const mcLocaleKey: InjectionKey<McLocaleInstance> = Symbol.for('mcui:locale')

function readMessage(messages: McLocaleMessages | undefined, key: string): string | undefined {
  let current: string | McLocaleMessages | undefined = messages
  for (const part of key.split('.')) {
    if (!current || typeof current === 'string') return undefined
    current = current[part]
  }
  return typeof current === 'string' ? current : undefined
}

export function createMcLocale(options: McLocaleOptions = {}, parent?: McLocaleInstance): McLocaleInstance {
  const locale = ref(options.locale ?? parent?.locale.value ?? 'zh-CN')
  const fallback = options.fallback ?? parent?.fallback ?? 'en'
  const messages = { ...defaultMcMessages, ...(parent?.messages ?? {}), ...(options.messages ?? {}) }
  const rtlLocales = Array.isArray(options.rtl)
    ? new Set(options.rtl)
    : new Set(
        Object.entries(options.rtl ?? {})
          .filter(([, rtl]) => rtl)
          .map(([name]) => name),
      )
  const isRtl = computed(
    () =>
      rtlLocales.has(locale.value) ||
      (!options.rtl && parent?.isRtl.value === true && locale.value === parent.locale.value),
  )
  const dir = computed(() => (isRtl.value ? 'rtl' : 'ltr'))

  return {
    locale,
    fallback,
    messages,
    isRtl,
    dir,
    t(key, params = {}) {
      const template =
        readMessage(messages[locale.value], key) ??
        readMessage(messages[fallback], key) ??
        readMessage(messages.en, key) ??
        key
      return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`))
    },
    setLocale(nextLocale: string) {
      locale.value = nextLocale
    },
  }
}

export function useMcLocale(): McLocaleInstance {
  return useMcService(mcLocaleKey, createMcLocale)
}
