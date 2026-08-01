<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import { Content } from 'vitepress/dist/client/app/components/Content.js'
import { VPNavBarSearch, VPSocialLink } from 'vitepress/theme'
import packageJson from '../../../package.json'
import DocsOutline from './DocsOutline.vue'
import DocsSidebarTree from './DocsSidebarTree.vue'
import { createDocsNavigation, normalizeDocsPath, stripDocsBase } from './docs-navigation'

const { site, theme, page, frontmatter, lang } = useData<DefaultTheme.Config>()
const route = useRoute()
const router = useRouter()

const isMobile = ref(false)
const desktopDrawerOpen = ref(true)
const mobileDrawerOpen = ref(false)
const outlinePanel = ref<string | null>(null)
let drawerPreferenceReady = false
let mobileQuery: MediaQueryList | undefined

const currentPath = computed(() => {
  const relativePath = page.value.relativePath
  if (relativePath && relativePath !== '404.md') {
    return normalizeDocsPath(`/${relativePath.replace(/\.md$/, '')}`)
  }
  return stripDocsBase(route.path, site.value.base)
})
const isHome = computed(() => currentPath.value === '/')
const isNotFound = computed(() => Boolean(page.value.isNotFound))
const layoutDisabled = computed(() => frontmatter.value.layout === false)
const navigation = computed(() =>
  createDocsNavigation(theme.value.sidebar, currentPath.value, {
    pageTitle: page.value.title,
    isHome: isHome.value,
    isNotFound: isNotFound.value,
  }),
)
const hasSidebar = computed(
  () => !isHome.value && !isNotFound.value && frontmatter.value.sidebar !== false && navigation.value.groups.length > 0,
)
const hasOutline = computed(
  () => !isHome.value && !isNotFound.value && frontmatter.value.aside !== false && page.value.headers.length > 0,
)
const drawerOpen = computed({
  get: () => (isMobile.value ? mobileDrawerOpen.value : desktopDrawerOpen.value),
  set: (value: boolean) => {
    if (isMobile.value) mobileDrawerOpen.value = value
    else desktopDrawerOpen.value = value
  },
})
const drawerMode = computed(() => (isMobile.value ? 'temporary' : 'persistent'))
const siteTitle = computed(() => (theme.value.siteTitle === false ? '' : (theme.value.siteTitle ?? site.value.title)))
const githubLink = computed(() => theme.value.socialLinks?.find((item) => item.icon === 'github'))
const lastUpdatedLabel = computed(() => theme.value.lastUpdated?.text ?? '最后更新于')
const formattedLastUpdated = computed(() => {
  if (!page.value.lastUpdated) return ''
  const options = theme.value.lastUpdated?.formatOptions ?? { dateStyle: 'medium' as const }
  return new Intl.DateTimeFormat(lang.value, options).format(new Date(page.value.lastUpdated))
})

function docsHref(link: string): string {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(link)) return link
  const suffixIndex = link.search(/[?#]/)
  const path = suffixIndex >= 0 ? link.slice(0, suffixIndex) : link
  const suffix = suffixIndex >= 0 ? link.slice(suffixIndex) : ''
  const htmlPath =
    site.value.cleanUrls || path === '/' || path.endsWith('/') || path.endsWith('.html') ? path : `${path}.html`
  return withBase(`${htmlPath}${suffix}`)
}

function toggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value
}

function closeMobileDrawer(): void {
  mobileDrawerOpen.value = false
}

function goHome(): void {
  void router.go(withBase('/'))
}

function updateMobile(event: MediaQueryListEvent | MediaQueryList): void {
  isMobile.value = event.matches
  if (!event.matches) mobileDrawerOpen.value = false
}

function isEditingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))
  )
}

function openSearchFromShortcut(event: KeyboardEvent): void {
  const isCommandK = event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)
  const isSlash = event.key === '/' && !isEditingTarget(event.target)
  if (!isCommandK && !isSlash) return
  event.preventDefault()
  document.querySelector<HTMLButtonElement>('.mc-docs-search .DocSearch-Button')?.click()
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 959px)')
  updateMobile(mobileQuery)
  mobileQuery.addEventListener('change', updateMobile)

  const storedDrawerState = window.localStorage.getItem('mcui-docs-drawer-open')
  if (storedDrawerState !== null) {
    const persistedOpen = storedDrawerState === 'true'
    desktopDrawerOpen.value = persistedOpen
    mobileDrawerOpen.value = persistedOpen
  }
  drawerPreferenceReady = true
  window.addEventListener('keydown', openSearchFromShortcut)
})

watch(desktopDrawerOpen, (open) => {
  if (drawerPreferenceReady) window.localStorage.setItem('mcui-docs-drawer-open', String(open))
})

watch(mobileDrawerOpen, (open) => {
  if (drawerPreferenceReady) window.localStorage.setItem('mcui-docs-drawer-open', String(open))
})

watch(
  () => page.value.relativePath,
  (nextPath, previousPath) => {
    if (nextPath === previousPath) return
    closeMobileDrawer()
    outlinePanel.value = null
    if (typeof window !== 'undefined') {
      void nextTick(() => window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 })))
    }
  },
)

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', updateMobile)
  window.removeEventListener('keydown', openSearchFromShortcut)
})
</script>

<template>
  <Content v-if="layoutDisabled" />

  <mc-app v-else class="mc-docs-app">
    <a class="mc-docs-skip-link" href="#mc-docs-content">跳到正文</a>
    <mc-layout>
      <mc-appbar :height="56" class="mc-docs-appbar" data-testid="docs-appbar">
        <template #left>
          <mc-appbar-icon
            v-if="hasSidebar"
            icon="mc-menu"
            class="mc-docs-menu-button"
            :aria-label="drawerOpen ? '收起文档导航' : '展开文档导航'"
            :aria-expanded="drawerOpen"
            aria-controls="mc-docs-sidebar"
            data-testid="docs-menu-button"
            @click="toggleDrawer"
          />
          <a class="mc-docs-brand" :href="withBase('/')" aria-label="返回文档首页">
            <img
              class="mc-docs-brand__logo"
              :src="withBase('/logo.svg')"
              width="32"
              height="32"
              alt=""
              aria-hidden="true"
              data-testid="docs-brand-logo"
            />
            <span class="mc-docs-brand__title">{{ siteTitle }}</span>
            <span class="mc-docs-brand__version">v{{ packageJson.version }}</span>
          </a>
        </template>

        <template #right>
          <div class="mc-docs-search"><VPNavBarSearch /></div>
          <a class="mc-docs-header-link" :href="docsHref('/contributors')">贡献者</a>
          <VPSocialLink
            v-if="githubLink"
            class="mc-docs-header-link mc-docs-github-link"
            :icon="githubLink.icon"
            :link="githubLink.link"
            aria-label="在 GitHub 查看源码"
          />
        </template>
      </mc-appbar>

      <mc-drawer
        v-if="hasSidebar"
        id="mc-docs-sidebar"
        v-model="drawerOpen"
        class="mc-docs-drawer"
        :mode="drawerMode"
        :size="300"
        :teleport="false"
        title="文档导航"
        aria-label="文档导航"
        data-testid="docs-sidebar"
        @close="closeMobileDrawer"
      >
        <mc-scroll-view>
          <nav class="mc-docs-sidebar-nav" aria-label="文档章节">
            <DocsSidebarTree :nodes="navigation.groups" :resolve-href="docsHref" root @navigate="closeMobileDrawer" />
          </nav>
        </mc-scroll-view>
      </mc-drawer>

      <mc-main>
        <div id="mc-docs-content" class="mc-docs-main" tabindex="-1">
          <section v-if="isNotFound" class="mc-docs-not-found" data-testid="docs-not-found">
            <mc-card>
              <template #title>
                <span class="mc-docs-not-found__code">404</span>
                页面走丢了
              </template>
              <div class="mc-docs-not-found__icon" aria-hidden="true">
                <mc-icon name="mc-home" :size="56" />
              </div>
              <p>这个方块可能被挖走、移动，或者从未生成。</p>
              <template #actions>
                <mc-button variant="primary" size="large" icon="mc-home" @click="goHome">返回首页</mc-button>
              </template>
            </mc-card>
          </section>

          <div v-else-if="isHome" class="mc-docs-home" data-testid="docs-home">
            <Content />
          </div>

          <div
            v-else
            class="mc-docs-frame"
            :class="{ 'mc-docs-frame--with-outline': hasOutline }"
            data-testid="docs-frame"
          >
            <article class="mc-docs-article">
              <mc-breadcrumbs
                v-if="navigation.breadcrumbs.length"
                class="mc-docs-breadcrumbs"
                :items="
                  navigation.breadcrumbs.map((item) => ({
                    title: item.title,
                    href: item.link ? docsHref(item.link) : undefined,
                  }))
                "
                divider="›"
                aria-label="面包屑"
              />

              <mc-expansion-panels
                v-if="hasOutline"
                v-model="outlinePanel"
                class="mc-docs-outline-panel"
                data-testid="docs-outline-panel"
              >
                <mc-expansion-panel value="outline" title="本页目录">
                  <DocsOutline :headers="page.headers" />
                </mc-expansion-panel>
              </mc-expansion-panels>

              <div class="vp-doc mc-docs-content"><Content /></div>

              <div v-if="formattedLastUpdated" class="mc-docs-last-updated">
                <span>{{ lastUpdatedLabel }}</span>
                <time :datetime="new Date(page.lastUpdated).toISOString()">{{ formattedLastUpdated }}</time>
              </div>

              <nav v-if="navigation.previous || navigation.next" class="mc-docs-page-nav" aria-label="前后页导航">
                <a
                  v-if="navigation.previous"
                  class="mc-docs-page-nav__link mc-docs-page-nav__link--previous"
                  :href="docsHref(navigation.previous.link)"
                  rel="prev"
                >
                  <span>上一页</span>
                  <strong>{{ navigation.previous.docFooterText ?? navigation.previous.text }}</strong>
                </a>
                <span v-else />
                <a
                  v-if="navigation.next"
                  class="mc-docs-page-nav__link mc-docs-page-nav__link--next"
                  :href="docsHref(navigation.next.link)"
                  rel="next"
                >
                  <span>下一页</span>
                  <strong>{{ navigation.next.docFooterText ?? navigation.next.text }}</strong>
                </a>
              </nav>
            </article>

            <aside v-if="hasOutline" class="mc-docs-outline-aside" data-testid="docs-outline">
              <DocsOutline :headers="page.headers" />
            </aside>
          </div>

          <footer v-if="theme.footer" class="mc-docs-footer">
            <p v-if="theme.footer.message">{{ theme.footer.message }}</p>
            <p v-if="theme.footer.copyright">{{ theme.footer.copyright }}</p>
          </footer>
        </div>
      </mc-main>
    </mc-layout>
  </mc-app>
</template>
