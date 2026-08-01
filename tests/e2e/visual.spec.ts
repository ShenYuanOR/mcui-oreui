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

  test('renders all 68 public components in the stable gallery', async ({ page }) => {
    const components = await page
      .locator('[data-gallery-component]')
      .evaluateAll((elements) => elements.map((element) => element.getAttribute('data-gallery-component')))
    expect(new Set(components).size).toBe(68)
    expect(components).toHaveLength(68)

    const skeleton = page.locator('[data-gallery-component="McSkeleton"]')
    await expect(skeleton).toHaveCSS('height', '38px')
    expect((await skeleton.boundingBox())?.height).toBe(38)

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
    await expect(page.locator('.gallery-states .mc-button__spinner')).toHaveCSS('border-radius', '50%')

    const activeTarget = page.locator('[data-state="active-button"]')
    const activeButton = activeTarget.locator('.mc-button')
    await activeTarget.hover()
    const restingFrame = await activeTarget.boundingBox()
    const restingButton = await activeButton.boundingBox()
    await page.mouse.down()
    const pressedFrame = await activeTarget.boundingBox()
    const pressedButton = await activeButton.boundingBox()
    expect(restingFrame).not.toBeNull()
    expect(restingButton).not.toBeNull()
    expect(pressedFrame).not.toBeNull()
    expect(pressedButton).not.toBeNull()
    expect(pressedFrame!.y).toBe(restingFrame!.y)
    expect(pressedFrame!.height).toBe(restingFrame!.height)
    expect(pressedButton!.y).toBe(restingButton!.y + 4)
    expect(pressedButton!.height).toBe(restingButton!.height - 4)
    expect(pressedButton!.y + pressedButton!.height).toBe(restingButton!.y + restingButton!.height)
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

    await expect(list).toHaveCSS('padding-left', '4px')
    await expect(list).toHaveCSS('margin-top', '0px')
    await expect(list).toHaveCSS('list-style-type', 'none')
    await expect(check).toHaveCount(1)
    await expect(check).toHaveCSS('width', '16px')
    await expect(check).toHaveCSS('image-rendering', 'pixelated')

    const [listBox, itemBox] = await Promise.all([list.boundingBox(), firstItem.boundingBox()])
    expect(listBox).not.toBeNull()
    expect(itemBox).not.toBeNull()
    expect(Math.abs(itemBox!.x - listBox!.x - 6)).toBeLessThanOrEqual(0.5)
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

  test('renders Table as a full-width continuous surface with row hover feedback', async ({ page }) => {
    const wrapper = page.locator('[data-gallery-component="McTable"]')
    const table = wrapper.locator('.mc-table')
    const rows = table.locator('tbody tr')
    const rowCount = await rows.count()
    expect(rowCount).toBe(2)
    const hoveredRow = rows.nth(1)

    await expect(table).toHaveCSS('display', 'table')
    const [wrapperBox, tableBox] = await Promise.all([wrapper.boundingBox(), table.boundingBox()])
    expect(wrapperBox).not.toBeNull()
    expect(tableBox).not.toBeNull()
    expect(Math.abs(wrapperBox!.width - tableBox!.width - 4)).toBeLessThanOrEqual(0.5)

    await hoveredRow.hover()
    const hoveredCells = hoveredRow.locator('td')
    const hoveredCellCount = await hoveredCells.count()
    expect(hoveredCellCount).toBe(2)
    await expect(hoveredCells.nth(0)).toHaveCSS('background-color', 'rgb(88, 88, 90)')
    await expect(hoveredCells.nth(1)).toHaveCSS('background-color', 'rgb(88, 88, 90)')
    await expect(hoveredCells.nth(0)).toHaveCSS('box-shadow', /rgb\(60, 133, 39\).*inset/)
  })

  test('keeps DataTable height stable while loading and renders its dropdown and empty state', async ({ page }) => {
    const table = page.locator('[data-gallery-component="McDataTable"]')
    const normalBody = await table.locator('tbody').boundingBox()
    expect(normalBody).not.toBeNull()
    await expect(table.locator('.mc-data-table__page-size select')).toHaveValue('2')
    await expect(table.locator('.mc-data-table__page-size-control')).toHaveCount(1)

    await page.goto('/visual?data-table-state=loading')
    await page.locator('.visual-gallery').waitFor()
    const loadingTable = page.locator('[data-gallery-component="McDataTable"]')
    const loadingBody = await loadingTable.locator('tbody').boundingBox()
    expect(loadingBody).not.toBeNull()
    expect(Math.abs(loadingBody!.height - normalBody!.height)).toBeLessThanOrEqual(1)
    await expect(loadingTable.locator('.mc-data-table__state--loading')).toBeVisible()
    await expect(loadingTable.locator('.mc-spinner')).toBeVisible()

    await page.goto('/visual?data-table-state=loading&data-table-loading-height=px')
    await page.locator('.visual-gallery').waitFor()
    const pixelLoadingBody = await page.locator('[data-gallery-component="McDataTable"] tbody').boundingBox()
    expect(pixelLoadingBody).not.toBeNull()
    expect(pixelLoadingBody!.height).toBe(320)

    await page.goto('/visual?data-table-state=loading&data-table-loading-height=rows')
    await page.locator('.visual-gallery').waitFor()
    const rowLoadingBody = await page.locator('[data-gallery-component="McDataTable"] tbody').boundingBox()
    expect(rowLoadingBody).not.toBeNull()
    expect(rowLoadingBody!.height).toBe(138)

    await page.goto('/visual?data-table-state=empty')
    await page.locator('.visual-gallery').waitFor()
    const emptyTable = page.locator('[data-gallery-component="McDataTable"]')
    await expect(emptyTable.locator('.mc-data-table__state--empty')).toContainText('No players found')
    await expect(emptyTable.locator('.mc-data-table__empty-icon')).toBeVisible()
  })

  test('keeps Panel header and footer fixed around a stretchable scrolling body', async ({ page }) => {
    const host = page.locator('.gallery-panel-host')
    const panel = page.locator('[data-gallery-component="McPanel"]')
    const header = panel.locator('.mc-panel__header')
    const body = panel.locator('.mc-panel__body')
    const footer = panel.locator('.mc-panel__footer')

    await expect(panel).toHaveCSS('display', 'grid')
    await expect(panel).toHaveCSS('overflow', 'hidden')
    await expect(body).toHaveCSS('min-height', '0px')
    await expect(body).toHaveCSS('overflow-y', 'auto')
    await expect(header).toHaveCount(1)
    await expect(footer).toHaveCount(1)

    const [hostBox, panelBox, headerBox, bodyBox, footerBox, dimensions] = await Promise.all([
      host.boundingBox(),
      panel.boundingBox(),
      header.boundingBox(),
      body.boundingBox(),
      footer.boundingBox(),
      body.evaluate((element) => ({ clientHeight: element.clientHeight, scrollHeight: element.scrollHeight })),
    ])
    expect(hostBox).not.toBeNull()
    expect(panelBox).not.toBeNull()
    expect(headerBox).not.toBeNull()
    expect(bodyBox).not.toBeNull()
    expect(footerBox).not.toBeNull()
    expect(Math.abs(panelBox!.width - hostBox!.width)).toBeLessThan(1)
    expect(bodyBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 0.5)
    expect(footerBox!.y).toBeGreaterThanOrEqual(bodyBox!.y + bodyBox!.height - 0.5)
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight)

    await body.hover()
    const footerY = (await footer.boundingBox())!.y
    await page.mouse.wheel(0, 120)
    await expect.poll(() => body.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
    expect(Math.abs((await footer.boundingBox())!.y - footerY)).toBeLessThanOrEqual(0.5)
  })

  test('keeps Dialog and Confirm section layouts isolated from host heading styles', async ({ page }) => {
    const dialog = page.locator('[data-gallery-component="McDialog"]')
    const confirm = page.locator('[data-gallery-component="McConfirm"]')
    const dialogTitle = dialog.locator('.mc-dialog__title')
    const confirmActions = confirm.locator(':scope > .mc-dialog__actions .mc-confirm__action')

    await expect(dialogTitle).toHaveCSS('margin', '0px')
    await expect(dialogTitle).toHaveCSS('padding', '0px')
    await expect(dialogTitle).toHaveCSS('border-top-width', '0px')
    await expect(confirmActions).toHaveCount(2)
    const structure = await confirm.evaluate((element) => ({
      children: Array.from(element.children).map((child) => child.className),
      titleHeight: element.querySelector('.mc-dialog__title')?.getBoundingClientRect().height,
    }))
    expect(structure.children).toEqual(['mc-dialog__header', 'mc-dialog__body', 'mc-dialog__actions'])
    expect(structure.titleHeight).toBeLessThanOrEqual(24)
    await expect(confirm).toHaveScreenshot('ore-confirm.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })
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
    const menu = page.getByRole('menu')
    const menuItems = menu.getByRole('menuitem')
    await expect(menu).toBeVisible()
    await expect(menuItems).toHaveCount(2)
    const itemBoxes = await menuItems.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().toJSON()),
    )
    expect(itemBoxes[1].top).toBeGreaterThanOrEqual(itemBoxes[0].bottom)
    expect(Math.abs(itemBoxes[0].width - itemBoxes[1].width)).toBeLessThan(1)
    await expect(menu).toHaveScreenshot('ore-menu-open.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })
    await page.keyboard.press('Escape')

    await page.locator('[data-state="tooltip-target"]').hover()
    const tooltip = page.getByRole('tooltip')
    await expect(tooltip).toBeVisible()
    const tooltipSurface = await tooltip.evaluate((element) => ({
      display: getComputedStyle(element).display,
      fragments: element.getClientRects().length,
      tag: element.tagName,
    }))
    expect(tooltipSurface).toEqual({ display: 'block', fragments: 1, tag: 'DIV' })
    await expect(tooltip).toHaveScreenshot('ore-tooltip-open.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    })
  })
})
