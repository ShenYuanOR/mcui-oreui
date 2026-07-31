import axe from 'axe-core'
import { expect, test } from '@playwright/test'

const docsBase = 'http://127.0.0.1:4179/mcui-oreui'

test('desktop drawer persists its state and marks the current page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${docsBase}/guide/getting-started.html`)

  const appbar = page.getByTestId('docs-appbar')
  await expect(appbar.getByRole('link', { name: '文档', exact: true })).toHaveCount(0)
  await expect(appbar.getByRole('link', { name: '设计 Token', exact: true })).toHaveCount(0)
  await expect(appbar.locator('.mc-docs-header-link')).toHaveText(['贡献者', 'GitHub'])
  await expect(appbar.getByRole('link', { name: '贡献者', exact: true })).toHaveAttribute(
    'href',
    '/mcui-oreui/contributors.html',
  )

  const sidebar = page.getByTestId('docs-sidebar')
  await expect(sidebar).toBeVisible()
  await expect(sidebar.getByRole('link', { name: '快速开始', exact: true })).toHaveAttribute('aria-current', 'page')

  await page.getByTestId('docs-menu-button').click()
  await expect(sidebar).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('docs-sidebar')).toHaveCount(0)

  await page.getByTestId('docs-menu-button').click()
  await expect(page.getByTestId('docs-sidebar')).toBeVisible()
})

test('mobile drawer traps focus, closes with Escape and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 760 })
  await page.goto(`${docsBase}/guide/getting-started.html`)
  await expect(page.getByTestId('docs-sidebar')).toHaveCount(0)

  await page.getByTestId('docs-menu-button').click()
  const dialog = page.getByRole('dialog', { name: '文档导航' })
  await expect(dialog).toBeVisible()

  const closeButton = dialog.locator('.mc-drawer__close')
  await expect(closeButton).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.locator('.mc-docs-sidebar-group__toggle').last()).toBeFocused()
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
  expect(await page.locator('#安装').evaluate((heading) => getComputedStyle(heading).scrollMarginTop)).toBe('76px')

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
