import { expect, test } from '@playwright/test'

test('dialog, nested menu, select, and tabs keyboard behavior', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await expect(page.getByRole('dialog', { name: 'World settings' })).toBeVisible()
  await expect(
    page.getByRole('dialog', { name: 'World settings' }).getByRole('button', { name: 'Close' }),
  ).toBeFocused()
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('menu')).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Save world' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Open dialog' })).toBeFocused()

  await page.getByRole('combobox', { name: 'Mode', exact: true }).press('ArrowDown')
  await page.getByRole('combobox', { name: 'Mode', exact: true }).press('Enter')
  await expect(page.getByRole('combobox', { name: 'Mode', exact: true })).toContainText('Survival')
  const firstTab = page.getByRole('tab', { name: 'One' })
  await firstTab.focus()
  await firstTab.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Two' })).toBeFocused()
  await expect(page.getByRole('tabpanel')).toContainText('Panel two')
})

test('connected overlay flips at the viewport edge and data table sorts', async ({ page }) => {
  await page.goto('/')
  const edge = page.getByRole('combobox', { name: 'Edge mode' })
  await edge.click()
  const popup = page.locator('.mc-overlay__content[data-location^="top"]')
  await expect(popup).toBeVisible()
  const popupBox = await popup.boundingBox()
  const edgeBox = await edge.boundingBox()
  expect(popupBox && edgeBox && popupBox.y + popupBox.height <= edgeBox.y + 1).toBeTruthy()
  await page.getByRole('button', { name: 'Score' }).click()
  await expect(page.locator('.mc-data-table tbody tr').first()).toContainText('Steve')
})

test('persistent drawer becomes temporary below the mobile breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.goto('/')
  await expect(page.locator('.mc-drawer--layout')).toBeVisible()
  await expect(page.locator('.mc-main')).toHaveAttribute('style', /--mc-layout-start: 220px/)
  await page.setViewportSize({ width: 600, height: 800 })
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible()
})
