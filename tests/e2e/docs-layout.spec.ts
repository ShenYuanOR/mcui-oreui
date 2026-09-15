import axe from 'axe-core'
import { expect, test } from '@playwright/test'

const docsBase = `${process.env.DOCS_E2E_URL ?? 'http://127.0.0.1:4179'}/mcui-oreui`

test('desktop drawer stays open and marks the current page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${docsBase}/guide/getting-started.html`)

  const appbar = page.getByTestId('docs-appbar')
  const sectionNav = page.getByTestId('docs-section-nav')
  await expect(sectionNav.getByRole('link', { name: '指南', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(sectionNav.getByRole('link', { name: '组件', exact: true })).toBeVisible()
  await expect(sectionNav.getByRole('link', { name: '样式', exact: true })).toBeVisible()
  await expect(appbar.getByRole('link', { name: '文档', exact: true })).toHaveCount(0)
  await expect(appbar.getByRole('link', { name: '设计 Token', exact: true })).toHaveCount(0)
  await expect(appbar.locator('.mc-docs-header-link')).toHaveCount(2)
  await expect(appbar.locator('.mc-docs-header-link')).toHaveText(['贡献者', ''])
  const githubLink = appbar.getByRole('link', { name: '在 GitHub 查看源码', exact: true })
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/ShenYuanOR/mcui-oreui')
  await expect(githubLink.locator('.vpi-social-github')).toBeVisible()
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/mcui-oreui/logo.svg')
  await expect(page.getByTestId('docs-brand-logo')).toHaveAttribute('src', '/mcui-oreui/logo.svg')
  await expect(appbar.getByRole('link', { name: '贡献者', exact: true })).toHaveAttribute(
    'href',
    '/mcui-oreui/contributors.html',
  )

  const sidebar = page.getByTestId('docs-sidebar')
  await expect(sidebar).toBeVisible()
  await expect(sidebar.getByRole('link', { name: '快速开始', exact: true })).toHaveAttribute('aria-current', 'page')
  await expect(sidebar.getByRole('link', { name: '按钮 / Button', exact: true })).toHaveCount(0)
  await expect(sidebar.getByRole('link', { name: '分辨率 / Breakpoints', exact: true })).toHaveCount(0)

  await sectionNav.getByRole('link', { name: '组件', exact: true }).click()
  await expect(page).toHaveURL(`${docsBase}/components/overview.html`)
  await expect(page.getByTestId('docs-section-nav').getByRole('link', { name: '组件', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(
    page.getByTestId('docs-sidebar').getByRole('link', { name: '组件总览 / Overview', exact: true }),
  ).toBeVisible()
  await expect(page.getByTestId('docs-sidebar').getByRole('link', { name: '快速开始', exact: true })).toHaveCount(0)

  await expect(page.getByTestId('docs-menu-button')).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('docs-sidebar')).toBeVisible()
  await expect(page.getByTestId('docs-menu-button')).toHaveCount(0)
})

test('mobile drawer traps focus, closes with Escape and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 760 })
  await page.goto(`${docsBase}/guide/getting-started.html`)
  await expect(page.getByTestId('docs-section-nav').getByRole('link', { name: '指南', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.getByTestId('docs-sidebar')).toHaveCount(0)

  await page.getByTestId('docs-menu-button').click()
  const dialog = page.getByRole('dialog', { name: '文档导航' })
  await expect(dialog).toBeVisible()

  const closeButton = dialog.locator('.mc-drawer__close')
  await expect(closeButton).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('link').last()).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(closeButton).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)

  await page.getByTestId('docs-menu-button').click()
  await dialog.getByRole('link', { name: '配置选项', exact: true }).click()
  await expect(page).toHaveURL(`${docsBase}/guide/configuration.html`)
  await expect(page.getByRole('dialog', { name: '文档导航' })).toHaveCount(0)
})

test('local search opens from the button and both documented keyboard shortcuts', async ({ page }) => {
  await page.goto(`${docsBase}/guide/getting-started.html`)

  await page.locator('.DocSearch-Button').click()
  await expect(page.locator('.VPLocalSearchBox')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.VPLocalSearchBox')).toHaveCount(0)

  await page.keyboard.press('Control+K')
  await expect(page.locator('.VPLocalSearchBox')).toBeVisible()
  await page.keyboard.press('Escape')

  await page.keyboard.press('/')
  await expect(page.locator('.VPLocalSearchBox')).toBeVisible()
})

test('wide and compact outlines navigate to headings and expose the active location', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${docsBase}/guide/configuration.html`)

  const wideOutline = page.getByTestId('docs-outline')
  await expect(wideOutline).toBeVisible()
  const themeLink = wideOutline.getByRole('link', { name: 'Theme 主题', exact: true })
  await themeLink.click()
  expect(decodeURI(new URL(page.url()).hash)).toBe('#theme-主题')
  await expect(themeLink).toHaveAttribute('aria-current', 'location')

  await page.setViewportSize({ width: 1100, height: 800 })
  await expect(wideOutline).toBeHidden()
  const compactOutline = page.getByTestId('docs-outline-panel')
  await expect(compactOutline).toBeVisible()
  await compactOutline.getByRole('button', { name: '本页目录' }).click()
  await expect(compactOutline.getByRole('link', { name: 'Sounds 音效', exact: true })).toBeVisible()
})

test('Vue examples use collapsible language tabs with normalized code formatting', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${docsBase}/components/drawer.html`)

  const examples = page.locator('.mc-docs-code-example')
  await expect(examples).not.toHaveCount(0)
  const example = examples.first()
  const toggle = example.getByRole('button', { name: /示例代码/ })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  const tabs = example.getByRole('tab')
  await expect(tabs).toHaveText(['JS', 'HTML', 'CSS'])
  await expect(example.getByRole('tab', { name: 'JS', exact: true })).toHaveAttribute('aria-selected', 'true')

  await example.getByRole('tab', { name: 'HTML', exact: true }).click()
  await expect(example.getByRole('tab', { name: 'HTML', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(example.locator('.language-html')).toBeVisible()
  await expect(example.locator('.language-js, .language-ts')).toHaveCount(0)
  await expect(example.locator('code')).toHaveCSS('tab-size', '2')

  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('component API tables fill the article and scroll inside their own mobile container', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${docsBase}/components/alert.html`)

  const wrapper = page.locator('.mc-docs-table-scroll')
  const table = wrapper.locator('table')
  await expect(table.locator('th')).toHaveText(['名称', '类型', '默认', '说明'])
  await expect(table).toHaveCSS('display', 'table')

  const desktop = await wrapper.evaluate((element) => {
    const tableElement = element.querySelector('table')
    return {
      wrapperWidth: element.getBoundingClientRect().width,
      tableWidth: tableElement?.getBoundingClientRect().width ?? 0,
    }
  })
  expect(desktop.tableWidth).toBeGreaterThanOrEqual(desktop.wrapperWidth - 4)

  await page.setViewportSize({ width: 390, height: 844 })
  const mobile = await wrapper.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(mobile.scrollWidth).toBeGreaterThan(mobile.clientWidth)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('Form demos constrain fixed-width controls without clipping their action rows', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 })
  await page.goto(`${docsBase}/components/form.html`)

  const demos = page.locator('.mc-form-demo')
  const actions = page.locator('.mc-form-demo-actions')
  await expect(demos).toHaveCount(2)
  await expect(actions).toHaveCount(2)

  const desktop = await actions.evaluateAll((elements) =>
    elements.map((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth })),
  )
  expect(desktop.every(({ clientWidth, scrollWidth }) => scrollWidth <= clientWidth)).toBe(true)

  const validationDemo = demos.nth(1)
  const status = validationDemo.locator('.mc-form-demo-status')
  await expect(status).toContainText('尚未校验')
  await validationDemo.getByRole('button', { name: '校验', exact: true }).click()
  await expect(status).not.toContainText('尚未校验')

  await page.setViewportSize({ width: 390, height: 844 })
  const mobile = await demos.evaluateAll((elements) =>
    elements.map((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth })),
  )
  expect(mobile.every(({ clientWidth, scrollWidth }) => scrollWidth <= clientWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('home, ordinary content and not-found views use the custom shell without horizontal overflow', async ({
  page,
}) => {
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto(`${docsBase}/`)
    await expect(page.getByTestId('docs-appbar')).toBeVisible()
    await expect(page.getByTestId('docs-home')).toBeVisible()
    await expect(page.getByTestId('docs-sidebar')).toHaveCount(0)
    await expect(page.getByTestId('docs-outline')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }

  await page.goto(`${docsBase}/guide/getting-started.html`)
  await expect(page.getByTestId('docs-frame')).toBeVisible()
  expect(await page.locator('#基础用法').evaluate((heading) => getComputedStyle(heading).scrollMarginTop)).toBe('76px')

  await page.goto(`${docsBase}/this-page-does-not-exist`)
  await expect(page.getByTestId('docs-not-found')).toBeVisible()
  await page.getByRole('button', { name: '返回首页' }).click()
  await expect(page).toHaveURL(`${docsBase}/`)
})

test('navigation, outline and content have no serious axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${docsBase}/guide/getting-started.html`)
  await page.addScriptTag({ content: axe.source })

  const results = await page.evaluate(async () => {
    const runner = (window as unknown as { axe: { run: () => Promise<{ violations: Array<{ impact: string }> }> } }).axe
    return runner.run()
  })
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))).toEqual([])
})
