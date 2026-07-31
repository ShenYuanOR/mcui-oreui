import { describe, expect, it } from 'vitest'
import type { DefaultTheme } from 'vitepress'
import {
  createDocsNavigation,
  normalizeNav,
  normalizeSidebar,
  stripDocsBase,
} from '../../docs/.vitepress/theme/docs-navigation'

const sidebar: DefaultTheme.Sidebar = [
  {
    text: '指南',
    items: [
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '配置选项', link: '/guide/configuration' },
    ],
  },
  {
    text: '组件',
    collapsed: true,
    items: [
      { text: '按钮', link: '/components/button' },
      { text: '图标', link: '/components/icon' },
    ],
  },
]

describe('documentation navigation normalization', () => {
  it('keeps configured collapsible groups and expands the active branch in the normalized data', () => {
    const groups = normalizeSidebar(sidebar, '/components/button.html')

    expect(groups[1]).toMatchObject({ text: '组件', collapsed: true, collapsible: true, containsActive: true })
    expect(groups[1].children[0]).toMatchObject({ text: '按钮', active: true })
    expect(groups[0].containsActive).toBe(false)
  })

  it('derives breadcrumbs and previous/next links from the same sidebar order', () => {
    const navigation = createDocsNavigation(sidebar, '/components/button', { pageTitle: '按钮' })

    expect(navigation.breadcrumbs).toEqual([
      { title: '首页', link: '/' },
      { title: '组件', link: undefined },
      { title: '按钮', link: undefined },
    ])
    expect(navigation.previous).toMatchObject({ text: '配置选项', link: '/guide/configuration' })
    expect(navigation.next).toMatchObject({ text: '图标', link: '/components/icon' })
  })

  it('returns no document chrome metadata for home and not-found pages', () => {
    expect(createDocsNavigation(sidebar, '/', { isHome: true }).breadcrumbs).toEqual([])
    const notFound = createDocsNavigation(sidebar, '/missing', { isNotFound: true })
    expect(notFound.breadcrumbs).toEqual([])
    expect(notFound.previous).toBeUndefined()
    expect(notFound.next).toBeUndefined()
  })

  it('supports path-scoped sidebars, bases and active nav matching', () => {
    const scoped: DefaultTheme.Sidebar = {
      '/guide/': { base: '/guide/', items: [{ text: 'Start', link: 'start' }] },
      '/api/': [{ text: 'API', link: '/api/index' }],
    }
    expect(normalizeSidebar(scoped, '/guide/start.html')[0]).toMatchObject({ link: '/guide/start', active: true })
    expect(stripDocsBase('/mcui-oreui/guide/start.html', '/mcui-oreui/')).toBe('/guide/start')

    const nav = normalizeNav(
      [
        { text: 'Guide', link: '/guide/start', activeMatch: '^/guide/' },
        { text: 'GitHub', link: 'https://github.com/example/repo' },
      ],
      '/guide/configuration',
    )
    expect(nav[0].active).toBe(true)
    expect(nav[1].active).toBe(false)
  })
})
