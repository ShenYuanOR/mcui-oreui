import { expect, test } from '@playwright/test'

test.describe('Ore UI visual regression gallery', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Pixel snapshots are maintained in Chromium only')

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/visual')
    await page.locator('.visual-gallery').waitFor()
    await page.evaluate(() => document.fonts.ready)
  })

  test('renders all 63 public components in the stable gallery', async ({ page }) => {
    const components = await page
      .locator('[data-gallery-component]')
      .evaluateAll((elements) => elements.map((element) => element.getAttribute('data-gallery-component')))
    expect(new Set(components).size).toBe(63)
    expect(components).toHaveLength(63)

    await expect(page).toHaveScreenshot('ore-gallery.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      mask: [page.locator('.mc-spinner__icon'), page.locator('.mc-loading-mask__spinner')],
      maskColor: '#8b8c8f',
      maxDiffPixelRatio: 0.01,
    })
  })

  test('captures hover, focus, active, selected, disabled, error, and loading states', async ({ page }) => {
    await page.locator('[data-state="hover-button"]').hover()
    await page.locator('[data-state="focus-input"]').focus()
    await expect(page.locator('.gallery-states')).toHaveScreenshot('ore-control-states.png', {
      animations: 'disabled',
      caret: 'hide',
      mask: [page.locator('.mc-spinner__icon')],
      maskColor: '#8b8c8f',
      maxDiffPixelRatio: 0.01,
    })

    await page.locator('[data-state="active-button"]').hover()
    await page.mouse.down()
    await expect(page.locator('.gallery-states')).toHaveScreenshot('ore-button-active.png', {
      animations: 'disabled',
      caret: 'hide',
      mask: [page.locator('.mc-spinner__icon')],
      maskColor: '#8b8c8f',
      maxDiffPixelRatio: 0.01,
    })
    await page.mouse.up()
  })

  test('centers single-line input text within the fixed control height', async ({ page }) => {
    const input = page.locator('[data-gallery-component="McTextField"] .mc-input')
    const metrics = await input.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        height: Number.parseFloat(style.height),
        borderTop: Number.parseFloat(style.borderTopWidth),
        borderBottom: Number.parseFloat(style.borderBottomWidth),
        paddingTop: Number.parseFloat(style.paddingTop),
        paddingBottom: Number.parseFloat(style.paddingBottom),
        lineHeight: Number.parseFloat(style.lineHeight),
      }
    })
    expect(metrics.paddingTop).toBe(metrics.paddingBottom)
    expect(
      metrics.borderTop + metrics.paddingTop + metrics.lineHeight + metrics.paddingBottom + metrics.borderBottom,
    ).toBe(metrics.height)
  })

  test('renders Slider and Switch with Ore UI visual layers', async ({ page }) => {
    const sliderRoot = page.locator('[data-gallery-component="McSlider"] .mc-slider')
    const sliderInput = sliderRoot.locator('.mc-slider__input')
    const sliderVisual = sliderRoot.locator('.mc-slider__visual')
    const sliderTrack = sliderRoot.locator('.mc-slider__track')
    const sliderFill = sliderRoot.locator('.mc-slider__fill')
    const sliderThumb = sliderRoot.locator('.mc-slider__thumb')

    await expect(sliderVisual).toHaveCount(1)
    const sliderStyles = await sliderInput.evaluate((input) => {
      const style = getComputedStyle(input)
      return { appearance: style.appearance, webkitAppearance: style.webkitAppearance, opacity: style.opacity }
    })
    expect(sliderStyles.appearance === 'none' || sliderStyles.webkitAppearance === 'none').toBe(true)
    expect(sliderStyles.opacity).toBe('0')
    await expect(sliderTrack).toHaveCSS('border-top-width', '2px')
    await expect(sliderThumb).toHaveCSS('width', '20px')
    expect(await sliderThumb.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none')
    const [inputBox, trackBox, fillBox, thumbBox] = await Promise.all([
      sliderInput.boundingBox(),
      sliderTrack.boundingBox(),
      sliderFill.boundingBox(),
      sliderThumb.boundingBox(),
    ])
    expect(inputBox).not.toBeNull()
    expect(trackBox).not.toBeNull()
    expect(fillBox).not.toBeNull()
    expect(thumbBox).not.toBeNull()
    expect(Math.abs(thumbBox!.width / trackBox!.height - (1 + Math.sqrt(5)) / 2)).toBeLessThan(0.06)
    expect(inputBox!.height).toBeGreaterThan(thumbBox!.height)
    expect(fillBox!.width).toBeGreaterThan(0)
    expect(fillBox!.width).toBeLessThan(trackBox!.width)
    await sliderInput.focus()
    await expect(sliderVisual).toHaveCSS('outline-style', 'solid')

    const switchRoot = page.locator('[data-gallery-component="McSwitch"] .mc-switch')
    const switchInput = switchRoot.locator('.mc-switch__input')
    const switchTrack = switchRoot.locator('.mc-switch__track')
    const switchThumb = switchRoot.locator('.mc-switch__thumb')
    await expect(switchTrack).toHaveCSS('width', '62px')
    await expect(switchThumb).toHaveCSS('width', '32px')
    expect(await switchTrack.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain(
      'linear-gradient',
    )
    expect(await switchThumb.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none')
    await expect(switchRoot.locator('.mc-switch__mark img')).toHaveCount(2)

    const checkedThumb = await switchThumb.boundingBox()
    await switchInput.setChecked(false, { force: true })
    const uncheckedThumb = await switchThumb.boundingBox()
    expect(checkedThumb).not.toBeNull()
    expect(uncheckedThumb).not.toBeNull()
    expect(checkedThumb!.x - uncheckedThumb!.x).toBeGreaterThan(24)
  })

  test('keeps ButtonTabs inside narrow containers', async ({ page }) => {
    const root = page.locator('[data-gallery-component="McButtonTabs"]')
    const nav = root.locator('.mc-button-tabs__nav')
    const tabs = nav.locator('.mc-button-tabs__tab')
    const buttons = tabs.locator(':scope > .mc-button')

    await root.evaluate((element) => {
      ;(element as HTMLElement).style.width = '320px'
    })
    await expect(tabs).toHaveCount(4)
    await expect(buttons).toHaveCount(4)

    const [rootBox, navBox, tabBoxes, buttonBoxes] = await Promise.all([
      root.boundingBox(),
      nav.boundingBox(),
      tabs.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON())),
      buttons.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON())),
    ])
    expect(rootBox).not.toBeNull()
    expect(navBox).not.toBeNull()
    expect(navBox!.width).toBeLessThanOrEqual(rootBox!.width + 0.5)
    expect(Math.max(...tabBoxes.map((box) => box.right))).toBeLessThanOrEqual(rootBox!.x + rootBox!.width + 0.5)
    expect(Math.min(...tabBoxes.map((box) => box.left))).toBeGreaterThanOrEqual(rootBox!.x - 0.5)
    expect(Math.max(...tabBoxes.map((box) => box.width)) - Math.min(...tabBoxes.map((box) => box.width))).toBeLessThan(
      1,
    )
    buttonBoxes.forEach((box, index) => expect(Math.abs(box.width - tabBoxes[index].width)).toBeLessThan(1))
    await expect(tabs.nth(2).locator('.mc-button-tabs__label')).toHaveCSS('text-overflow', 'ellipsis')
    await expect(tabs.first().locator(':scope > .mc-button')).toHaveCSS('background-color', 'rgb(60, 133, 39)')
  })

  test('keeps List reset isolated from host list styles and renders pixel checks', async ({ page }) => {
    const list = page.locator('.gallery-list-host .mc-list')
    const firstItem = list.locator('.mc-list__item').first()
    const check = firstItem.locator('.mc-list__checkbox img')

    await expect(list).toHaveCSS('padding-left', '0px')
    await expect(list).toHaveCSS('margin-top', '0px')
    await expect(list).toHaveCSS('list-style-type', 'none')
    await expect(check).toHaveCount(1)
    await expect(check).toHaveCSS('width', '16px')
    await expect(check).toHaveCSS('image-rendering', 'pixelated')

    const [listBox, itemBox] = await Promise.all([list.boundingBox(), firstItem.boundingBox()])
    expect(listBox).not.toBeNull()
    expect(itemBox).not.toBeNull()
    expect(Math.abs(itemBox!.x - listBox!.x - 2)).toBeLessThanOrEqual(0.5)
  })

  test('clips and scrolls ScrollView inside its fixed-height viewport', async ({ page }) => {
    const root = page.locator('[data-gallery-component="McScrollView"]')
    const viewport = root.locator('.mc-scroll-view__container')
    const thumb = root.locator('.mc-scroll-view__thumb')

    await expect(root).toHaveCSS('overflow', 'hidden')
    await expect(viewport).toHaveCSS('overflow-y', 'auto')
    await expect(thumb).toBeVisible()
    const dimensions = await viewport.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }))
    expect(dimensions.clientHeight).toBe(150)
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight)

    await viewport.hover()
    await page.mouse.wheel(0, 100)
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
    expect(await thumb.evaluate((element) => getComputedStyle(element).transform)).not.toBe('matrix(1, 0, 0, 1, 0, 0)')
  })

  test('resists host list and heading offsets in navigation flow components', async ({ page }) => {
    const breadcrumbList = page.locator('.mc-breadcrumbs__list')
    const breadcrumbItems = breadcrumbList.locator('.mc-breadcrumbs__item')
    const expansionHeading = page.locator('.mc-expansion-panel__heading').first()
    const stepperHeader = page.locator('.mc-stepper__header')
    const stepperItems = stepperHeader.locator('.mc-stepper__step')

    await expect(breadcrumbList).toHaveCSS('margin-top', '0px')
    await expect(breadcrumbList).toHaveCSS('padding-left', '0px')
    await expect(breadcrumbList).toHaveCSS('list-style-type', 'none')
    await expect(breadcrumbItems.nth(1)).toHaveCSS('margin-top', '0px')
    await expect(expansionHeading).toHaveCSS('margin-top', '0px')
    await expect(stepperHeader).toHaveCSS('margin-top', '0px')
    await expect(stepperHeader).toHaveCSS('padding-left', '0px')
    await expect(stepperHeader).toHaveCSS('list-style-type', 'none')
    await expect(stepperItems.nth(1)).toHaveCSS('margin-top', '0px')

    const breadcrumbTops = await breadcrumbItems.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    )
    const stepperTops = await stepperItems.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    )
    expect(Math.max(...breadcrumbTops) - Math.min(...breadcrumbTops)).toBeLessThan(1)
    expect(Math.max(...stepperTops) - Math.min(...stepperTops)).toBeLessThan(1)
  })

  test('keeps VirtualScroll visible inside flex hosts', async ({ page }) => {
    const root = page.locator('[data-gallery-component="McVirtualScroll"]')
    const firstItem = root.locator('.mc-virtual-scroll__item').first()

    await root.evaluate((element) => {
      const host = element.parentElement
      if (!host) return
      host.style.display = 'flex'
      host.style.width = '640px'
      for (const child of Array.from(host.children)) {
        if (child !== element) (child as HTMLElement).style.display = 'none'
      }
    })

    await expect(root).toHaveCSS('width', '640px')
    await expect(firstItem).toBeVisible()
    await expect(firstItem).toContainText('Chunk 1')
    expect((await firstItem.boundingBox())?.width).toBeGreaterThan(600)
  })

  test('captures connected menu and tooltip surfaces', async ({ page }) => {
    await page.locator('[data-state="menu-target"]').click()
    await expect(page.getByRole('menu')).toBeVisible()
    await expect(page.getByRole('menu')).toHaveScreenshot('ore-menu-open.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })
    await page.keyboard.press('Escape')

    await page.locator('[data-state="tooltip-target"]').hover()
    await expect(page.getByRole('tooltip')).toBeVisible()
    await expect(page.getByRole('tooltip')).toHaveScreenshot('ore-tooltip-open.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })
  })
})
