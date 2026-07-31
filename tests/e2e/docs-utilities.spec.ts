import { expect, test } from '@playwright/test'

const stylesBase = 'http://127.0.0.1:4179/mcui-oreui/styles'

test.beforeEach(({ browserName }) => {
  test.skip(browserName !== 'chromium', 'Documentation utility effects are verified in Chromium')
})

test('renders utility families as separate style chapters with live computed effects', async ({ page }) => {
  await page.goto(`${stylesBase}/display.html`)
  await expect(page.locator('.mc-demo .d-block.bg-primary').first()).toHaveCSS('display', 'block')
  const screenOnly = page.locator('[data-print-visibility="screen"]')
  const printOnly = page.locator('[data-print-visibility="print"]')
  await expect(screenOnly).toBeVisible()
  await expect(printOnly).toBeHidden()
  await page.emulateMedia({ media: 'print' })
  await expect(screenOnly).toBeHidden()
  await expect(printOnly).toBeVisible()
  await page.emulateMedia({ media: 'screen' })
  await expect(page.getByRole('link', { name: '样式工具类总览 / Utilities', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: '弹性布局 / Flex', exact: true })).toHaveAttribute(
    'href',
    '/mcui-oreui/styles/flex.html',
  )
  await expect(page.getByRole('link', { name: '间距与间隙 / Spacing & Gap', exact: true })).toHaveAttribute(
    'href',
    '/mcui-oreui/styles/spacing.html',
  )
  await expect(page.getByRole('link', { name: '定位与浮动 / Position & Float', exact: true })).toHaveAttribute(
    'href',
    '/mcui-oreui/styles/position-float.html',
  )
  await expect(page.getByRole('link', { name: '尺寸 / Sizing', exact: true })).toHaveAttribute(
    'href',
    '/mcui-oreui/styles/sizing.html',
  )

  await page.goto(`${stylesBase}/flex.html`)
  const flexDemo = page.locator('.mc-demo .d-flex.flex-wrap.ga-3').first()
  await expect(flexDemo).toHaveCSS('display', 'flex')
  await expect(flexDemo).toHaveCSS('gap', '12px')

  await page.goto(`${stylesBase}/elevation.html`)
  expect(await page.locator('.elevation-8').evaluate((element) => getComputedStyle(element).boxShadow)).toContain(
    '8px 8px 0px',
  )

  await page.goto(`${stylesBase}/theme-colors.html`)
  await expect(page.locator('.bg-primary').first()).toHaveCSS('background-color', 'rgb(60, 133, 39)')

  await page.goto(`${stylesBase}/position-float.html`)
  await expect(page.locator('.position-absolute.top-0').first()).toHaveCSS('position', 'absolute')
  await expect(page.locator('[data-position-float="ltr"]')).toHaveCSS('float', 'left')
  await expect(page.locator('[data-position-float="rtl"]')).toHaveCSS('float', 'right')

  await page.goto(`${stylesBase}/sizing.html`)
  const sizingSurface = page.locator('[data-sizing="width"]').locator('..')
  const sizingWidth = page.locator('[data-sizing="width"]')
  expect(
    await sizingWidth.evaluate(
      (element, parent) => element.getBoundingClientRect().width / (parent as Element).getBoundingClientRect().width,
      await sizingSurface.elementHandle(),
    ),
  ).toBeCloseTo(0.25, 1)
})

test('loads a family-specific searchable class table instead of the full overview catalog', async ({ page }) => {
  await page.goto(`${stylesBase}/spacing.html`)
  const catalog = page.locator('.mc-utility-catalog')
  await expect(catalog.getByText(/本章 3060 个具体类汇总为 \d+ 组/)).toBeVisible()
  await catalog.getByRole('searchbox').fill('ma-md-4')
  await expect(catalog.getByText('ma-4 / ma-{breakpoint}-4', { exact: true })).toBeVisible()
  await expect(catalog.getByText('ma-md-4', { exact: true })).toHaveCount(0)
  await expect(catalog.getByText('d-md-flex', { exact: true })).toHaveCount(0)

  await page.goto(`${stylesBase}/position-float.html`)
  const floatCatalog = page.locator('.mc-utility-catalog')
  await floatCatalog.getByRole('searchbox').fill('float-sm-none')
  await expect(floatCatalog.getByText('float-none / float-{breakpoint}-none', { exact: true })).toBeVisible()
  await expect(floatCatalog.getByText('float-sm-none', { exact: true })).toHaveCount(0)
})

test('documents breakpoints once and demonstrates their real viewport effect', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 720 })
  await page.goto(`${stylesBase}/breakpoints.html`)
  await page.getByTestId('docs-menu-button').click()
  await expect(page.getByRole('link', { name: '分辨率 / Breakpoints', exact: true })).toHaveAttribute(
    'href',
    '/mcui-oreui/styles/breakpoints.html',
  )
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-breakpoint="sm"]')).toBeVisible()
  await expect(page.locator('[data-breakpoint="md"]')).toBeHidden()

  const layout = page.locator('[data-testid="resolution-layout"]')
  await expect(layout).toHaveCSS('flex-direction', 'column')
  await expect(layout).toHaveCSS('padding-top', '8px')

  await page.setViewportSize({ width: 1000, height: 720 })
  await expect(page.locator('[data-breakpoint="sm"]')).toBeHidden()
  await expect(page.locator('[data-breakpoint="md"]')).toBeVisible()
  await expect(layout).toHaveCSS('flex-direction', 'row')
  await expect(layout).toHaveCSS('padding-top', '24px')
})
