import { test, expect } from '@playwright/test'

test.describe('Home Page E2E', () => {
  test('renders landing page title and toggle theme', async ({ page }) => {
    await page.goto('/')

    // Assert main heading renders
    await expect(page.locator('h1')).toContainText('Design Token & Atomic Architecture System')

    // Assert initial theme attribute
    const htmlElement = page.locator('html')
    await expect(htmlElement).toHaveAttribute('data-theme', 'light')

    // Find and click ThemeToggle button
    const themeButton = page.locator('button[aria-label*="Current theme"]').first()
    await expect(themeButton).toBeVisible()

    // Click toggle to cycle theme to dark
    await themeButton.click()
    await expect(htmlElement).toHaveAttribute('data-theme', 'dark')
  })
})
