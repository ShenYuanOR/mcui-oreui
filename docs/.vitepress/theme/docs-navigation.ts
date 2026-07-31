import type { DefaultTheme } from 'vitepress'

export interface DocsSidebarNode {
  id: string
  text: string
  link?: string
  rel?: string
  target?: string
  docFooterText?: string
  collapsed: boolean
  collapsible: boolean
  active: boolean
  containsActive: boolean
  children: DocsSidebarNode[]
}

export interface DocsBreadcrumb {
  title: string
  link?: string
}

export interface DocsPageLink {
  text: string
  link: string
  docFooterText?: string
}

export interface DocsNavigation {
  groups: DocsSidebarNode[]
  breadcrumbs: DocsBreadcrumb[]
  previous?: DocsPageLink
  next?: DocsPageLink
}

export interface DocsNavItem {
  id: string
  text: string
  link?: string
  rel?: string
  target?: string
  active: boolean
  children: DocsNavItem[]
}

interface NavigationOptions {
  homeTitle?: string
  pageTitle?: string
  isHome?: boolean
  isNotFound?: boolean
}

function isExternalLink(link: string): boolean {
  return /^(?:[a-z]+:|\/\/)/i.test(link)
}

function joinPath(base: string, path: string): string {
  if (!base || path.startsWith('/') || path.startsWith('#') || isExternalLink(path)) return path
  return `${base.replace(/\/$/, '')}/${path.replace(/^\.\//, '')}`
}

function normalizeBase(parentBase: string, base?: string): string {
  if (!base) return parentBase
  if (base.startsWith('/') || isExternalLink(base)) return base
  return joinPath(parentBase, base)
}

export function normalizeDocsPath(path: string): string {
  if (!path) return '/'
  const withoutOrigin = path.replace(/^https?:\/\/[^/]+/i, '')
  const clean = withoutOrigin
    .split(/[?#]/, 1)[0]
    .replace(/\\/g, '/')
    .replace(/\.html$/, '')
    .replace(/\/index$/, '/')
  const withLeadingSlash = clean.startsWith('/') ? clean : `/${clean}`
  const withoutTrailingSlash = withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/$/, '') : withLeadingSlash
  return withoutTrailingSlash || '/'
}

export function stripDocsBase(path: string, base: string): string {
  const normalizedPath = normalizeDocsPath(path)
  const normalizedBase = normalizeDocsPath(base)
  if (normalizedBase === '/') return normalizedPath
  if (normalizedPath === normalizedBase) return '/'
  return normalizedPath.startsWith(`${normalizedBase}/`)
    ? normalizedPath.slice(normalizedBase.length) || '/'
    : normalizedPath
}

export function isDocsLinkActive(path: string, link?: string, activeMatch?: string): boolean {
  if (!link || isExternalLink(link) || link.startsWith('#')) return false
  if (activeMatch) {
    try {
      return new RegExp(activeMatch).test(path)
    } catch {
      return false
    }
  }
  return normalizeDocsPath(path) === normalizeDocsPath(link)
}

function resolveSidebar(sidebar: DefaultTheme.Sidebar | undefined, currentPath: string): DefaultTheme.SidebarItem[] {
  if (!sidebar) return []
  if (Array.isArray(sidebar)) return sidebar

  const match = Object.entries(sidebar)
    .filter(([prefix]) => {
      const normalizedPrefix = normalizeDocsPath(prefix)
      return currentPath === normalizedPrefix || currentPath.startsWith(`${normalizedPrefix}/`)
    })
    .sort(([left], [right]) => right.length - left.length)[0]
  if (!match) return []

  const value = match[1]
  return Array.isArray(value) ? value : value.items.map((item) => ({ ...item, base: value.base }))
}

function normalizeSidebarItem(
  item: DefaultTheme.SidebarItem,
  currentPath: string,
  id: string,
  parentBase = '',
): DocsSidebarNode {
  const childBase = normalizeBase(parentBase, item.base)
  const link = item.link ? joinPath(childBase, item.link) : undefined
  const children = (item.items ?? []).map((child, index) =>
    normalizeSidebarItem(child, currentPath, `${id}-${index}`, childBase),
  )
  const active = isDocsLinkActive(currentPath, link)

  return {
    id,
    text: item.text ?? '',
    link,
    rel: item.rel,
    target: item.target,
    docFooterText: item.docFooterText,
    collapsed: item.collapsed ?? false,
    collapsible: item.collapsed !== undefined,
    active,
    containsActive: active || children.some((child) => child.containsActive),
    children,
  }
}

export function normalizeSidebar(sidebar: DefaultTheme.Sidebar | undefined, currentPath: string): DocsSidebarNode[] {
  const normalizedPath = normalizeDocsPath(currentPath)
  return resolveSidebar(sidebar, normalizedPath).map((item, index) =>
    normalizeSidebarItem(item, normalizedPath, `sidebar-${index}`),
  )
}

function flattenLinkedNodes(nodes: DocsSidebarNode[]): DocsPageLink[] {
  return nodes.flatMap((node) => {
    const current = node.link ? [{ text: node.text, link: node.link, docFooterText: node.docFooterText }] : []
    return [...current, ...flattenLinkedNodes(node.children)]
  })
}

function findActiveTrail(nodes: DocsSidebarNode[]): DocsSidebarNode[] {
  for (const node of nodes) {
    if (node.active) return [node]
    const childTrail = findActiveTrail(node.children)
    if (childTrail.length) return [node, ...childTrail]
  }
  return []
}

export function createDocsNavigation(
  sidebar: DefaultTheme.Sidebar | undefined,
  currentPath: string,
  options: NavigationOptions = {},
): DocsNavigation {
  const groups = normalizeSidebar(sidebar, currentPath)
  if (options.isHome || options.isNotFound) return { groups, breadcrumbs: [] }

  const flatItems = flattenLinkedNodes(groups)
  const currentIndex = flatItems.findIndex((item) => isDocsLinkActive(currentPath, item.link))
  const trail = findActiveTrail(groups)
  const breadcrumbs: DocsBreadcrumb[] = [{ title: options.homeTitle ?? '首页', link: '/' }]

  if (trail.length) {
    breadcrumbs.push(
      ...trail.map((node, index) => ({
        title: node.text,
        link: index === trail.length - 1 ? undefined : node.link,
      })),
    )
  } else if (options.pageTitle) {
    breadcrumbs.push({ title: options.pageTitle })
  }

  return {
    groups,
    breadcrumbs,
    previous: currentIndex > 0 ? flatItems[currentIndex - 1] : undefined,
    next: currentIndex >= 0 && currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : undefined,
  }
}

function isNavLink(item: DefaultTheme.NavItem): item is DefaultTheme.NavItemWithLink {
  return 'link' in item && typeof item.link === 'string'
}

function normalizeNavItem(item: DefaultTheme.NavItem, currentPath: string, id: string): DocsNavItem | undefined {
  if ('component' in item) return undefined
  if (isNavLink(item)) {
    return {
      id,
      text: item.text,
      link: item.link,
      rel: item.rel,
      target: item.target,
      active: isDocsLinkActive(currentPath, item.link, item.activeMatch),
      children: [],
    }
  }

  const children = item.items.flatMap((child, index) => {
    if ('items' in child && !('link' in child)) {
      return child.items.map((nested, nestedIndex) =>
        normalizeNavItem(nested, currentPath, `${id}-${index}-${nestedIndex}`),
      )
    }
    return [normalizeNavItem(child, currentPath, `${id}-${index}`)]
  })

  const normalizedChildren = children.filter((child): child is DocsNavItem => Boolean(child))
  return {
    id,
    text: item.text ?? '',
    active: normalizedChildren.some((child) => child.active),
    children: normalizedChildren,
  }
}

export function normalizeNav(nav: DefaultTheme.NavItem[] | undefined, currentPath: string): DocsNavItem[] {
  return (nav ?? [])
    .map((item, index) => normalizeNavItem(item, normalizeDocsPath(currentPath), `nav-${index}`))
    .filter((item): item is DocsNavItem => Boolean(item))
}
