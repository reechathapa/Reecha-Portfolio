import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'
import { isUnexpectedConsoleMessage } from '../scripts/test-console'

// Exercise the actual GPU path on capable test browsers. Low-power cases below
// explicitly override these values again before loading the page.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, get: () => 8 })
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, get: () => 8 })
  })
})

test('the editorial homepage renders without runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (isUnexpectedConsoleMessage(message)) errors.push(message.text()) })
  await page.goto('/')
  await expect(page).toHaveTitle('Reecha Thapa — Search, with purpose.')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Turning search into your next big opportunity.')
  await expect(page.locator('main > section')).toHaveCount(9)
  await expect(page.locator('.project-card')).toHaveCount(3)
  await expect(page.locator('.note-card')).toHaveCount(3)
  await expect(page.getByRole('button', { name: 'Pause animations' })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.fonts.check('16px "Manrope Variable"'))).toBeTruthy()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  expect(errors).toEqual([])
})

test('project filters support mouse and roving keyboard selection', async ({ page }) => {
  await page.goto('/')
  const tabs = page.getByRole('tablist', { name: 'Filter project concepts' })
  await tabs.getByRole('tab', { name: 'B2B SaaS' }).click()
  await expect(page.locator('.project-card')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'Explore Orbit concept study' })).toBeVisible()
  await page.keyboard.press('End')
  await expect(tabs.getByRole('tab', { name: 'Local discovery' })).toBeFocused()
  await expect(page.getByRole('button', { name: 'Explore Stillhouse concept study' })).toBeVisible()
  await page.keyboard.press('Home')
  await expect(tabs.getByRole('tab', { name: 'All work' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.project-card')).toHaveCount(3)
})

test('each project has a real detail view, a focus boundary, and Escape dismissal', async ({ page }) => {
  await page.goto('/')
  for (const brand of ['Verdant', 'Orbit', 'Stillhouse']) {
    const trigger = page.getByRole('button', { name: `Explore ${brand} concept study` })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'A considered approach' })).toBeVisible()
    await expect(dialog.locator('.project-approach > li')).toHaveCount(3)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      expect(await page.evaluate(() => document.querySelector('dialog')!.contains(document.activeElement))).toBeTruthy()
    }
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  }
})

test('search intent maps custom queries locally and has accessible category tabs', async ({ page }) => {
  await page.goto('/')
  const tabs = page.getByRole('tablist', { name: 'Explore search intent' })
  await tabs.getByRole('tab', { name: 'Learn something' }).click()
  await expect(page.getByRole('heading', { name: 'Earn trust', exact: true })).toBeVisible()
  await page.keyboard.press('End')
  await expect(tabs.getByRole('tab', { name: 'Take action' })).toBeFocused()
  await expect(page.getByRole('heading', { name: 'Enable action', exact: true })).toBeVisible()
  await page.getByRole('searchbox', { name: 'Try a search query' }).fill('best workflow tools for a small team')
  await page.getByRole('button', { name: 'Map search intent' }).click()
  await expect(tabs.getByRole('tab', { name: 'Compare options' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.intent-footnote > p')).toContainText('commercial')
  await page.getByRole('searchbox').fill('book a quiet retreat')
  await page.getByRole('searchbox').press('Enter')
  await expect(tabs.getByRole('tab', { name: 'Take action' })).toHaveAttribute('aria-selected', 'true')
  await page.getByRole('searchbox').fill('why does an olive tree lose leaves')
  await page.getByRole('searchbox').press('Enter')
  await expect(tabs.getByRole('tab', { name: 'Learn something' })).toHaveAttribute('aria-selected', 'true')
})

test('expertise disclosures and tool categories reveal useful content', async ({ page }) => {
  await page.goto('/')
  const technical = page.getByRole('button', { name: '03 Technical foundations' })
  await technical.click()
  await expect(technical).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('region', { name: '03 Technical foundations' })).toContainText('crawlability')
  await technical.click()
  await expect(technical).toHaveAttribute('aria-expanded', 'false')
  const tabs = page.getByRole('tablist', { name: 'Explore tool categories' })
  await tabs.getByRole('tab', { name: 'Measurement' }).click()
  await page.getByRole('button', { name: /Looker Studio/ }).click()
  await expect(page.locator('.tool-description')).toContainText('readable dashboard')
  await tabs.getByRole('tab', { name: 'Content' }).click()
  await expect(page.locator('.tool-description')).toContainText('editorial briefs')
  await page.getByRole('button', { name: /Google Sheets/ }).click()
  await expect(page.locator('.tool-description')).toContainText('content inventories')
})

test('the desktop story pins briefly, advances, and releases into native scrolling', async ({ page }) => {
  await page.goto('/')
  const start = await page.locator('.case-journey').evaluate(element => element.getBoundingClientRect().top + window.scrollY)
  await page.evaluate(top => window.scrollTo({ top: top - 116 + 50, behavior: 'instant' }), start)
  await expect.poll(async () => Math.round((await page.locator('.case-board').boundingBox())!.y)).toBe(116)
  await page.evaluate(top => window.scrollTo({ top: top - 116 + 270, behavior: 'instant' }), start)
  await expect(page.locator('.case-step-controls').getByRole('button', { name: '02 Connect' })).toHaveAttribute('aria-pressed', 'true')
  await page.locator('nav[aria-label="Main navigation"]').getByRole('link', { name: 'About', exact: true }).click()
  await expect(page).toHaveURL(/#about$/)
  await expect(page.getByRole('heading', { name: 'A curious mind. A clear point of view.' })).toBeInViewport()
  expect((await page.locator('.case-board').boundingBox())!.y).toBeLessThan(0)
})

test('performance data changes, can be explored by keyboard, and has a full data table', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Search visibility index 2.6/ }).click()
  await expect(page.locator('.chart-header h3')).toHaveText('Search visibility index')
  const slider = page.getByRole('slider', { name: 'Explore the months' })
  await slider.focus()
  await page.keyboard.press('Home')
  await expect(slider).toHaveAttribute('aria-valuetext', 'Jan: 20 index')
  await expect(page.locator('.chart-selected')).toContainText('20')
  await page.keyboard.press('End')
  await expect(slider).toHaveAttribute('aria-valuetext', 'Dec: 52 index')
  await page.getByRole('tablist', { name: 'Chart metric' }).getByRole('tab', { name: 'Actions' }).click()
  await expect(page.locator('.chart-header h3')).toHaveText('Qualified actions')
  await page.getByText('View the data', { exact: false }).click()
  await expect(page.getByRole('table')).toBeVisible()
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(13)
  await expect(page.locator('.data-disclaimer')).toContainText('not client results')
})

test('every note opens complete, readable writing', async ({ page }) => {
  await page.goto('/')
  for (const title of ['Rankings are a signal. Not the whole story.', 'The best keyword isn’t always the biggest.', 'Less reporting. More understanding.']) {
    const trigger = page.getByRole('button', { name: `Read ${title}` })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(title)
    await expect(dialog.locator('article > section')).toHaveCount(3)
    await expect(dialog.locator('blockquote')).not.toBeEmpty()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  }
})

test('contact validates a brief and supports copy, download, and edit without fake sending', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  await page.locator('.header-contact').click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Prepare my message' }).click()
  await expect(dialog.getByRole('textbox', { name: 'Your name', exact: true })).toBeFocused()
  await dialog.getByRole('textbox', { name: 'Your name', exact: true }).fill('Alex Reader')
  await dialog.getByRole('textbox', { name: 'Email address' }).fill('alex@example.com')
  await dialog.getByRole('textbox', { name: /Website or company/ }).fill('Example Studio')
  await dialog.getByRole('combobox', { name: 'Where could I help?' }).selectOption('Technical SEO')
  await dialog.getByRole('textbox', { name: 'What would you like to make possible?' }).fill('Make our useful product guides easier to discover and understand.')
  await dialog.getByRole('button', { name: 'Prepare my message' }).click()
  await expect(dialog.getByText('Your message is ready. Nothing has been sent.')).toBeVisible()
  await expect(dialog.getByRole('textbox', { name: 'Your prepared message' })).toContainText('Alex Reader')
  await dialog.getByRole('button', { name: 'Copy message' }).click()
  await expect(dialog.getByRole('status')).toHaveText('Message copied. It has not been sent.')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('technical seo')
  const downloadEvent = page.waitForEvent('download')
  await dialog.getByRole('button', { name: 'Download brief' }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe('project-brief-for-reecha.txt')
  expect(await readFile((await download.path())!, 'utf8')).toContain('alex@example.com')
  await dialog.getByRole('button', { name: 'Edit the details' }).click()
  await expect(dialog.getByRole('textbox', { name: 'Your name', exact: true })).toHaveValue('Alex Reader')
  await page.keyboard.press('Escape')
  await expect(page.locator('.header-contact')).toBeFocused()
})

test('following a case journey places keyboard focus at the destination', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Explore Verdant concept study' }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'Follow the full journey' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(/#case-study$/)
  await expect(page.locator('#case-heading')).toBeFocused()
  await expect(page.locator('#case-heading')).toBeInViewport()
})

test('a whitespace-only contact brief is not accepted', async ({ page }) => {
  await page.goto('/')
  await page.locator('.header-contact').click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('textbox', { name: 'Your name', exact: true }).fill('   ')
  await dialog.getByRole('textbox', { name: 'Email address' }).fill('alex@example.com')
  await dialog.getByRole('textbox', { name: 'What would you like to make possible?' }).fill('               ')
  await dialog.getByRole('button', { name: 'Prepare my message' }).click()
  await expect(dialog.getByRole('textbox', { name: 'Your prepared message' })).toHaveCount(0)
  expect(await dialog.getByRole('textbox', { name: 'Your name', exact: true }).evaluate(element => (element as HTMLInputElement).validationMessage)).toBe('Please enter your name.')
  await dialog.getByRole('textbox', { name: 'Your name', exact: true }).fill('Alex')
  await dialog.getByRole('textbox', { name: 'What would you like to make possible?' }).fill('A useful strategy for our new product pages.')
  await dialog.getByRole('button', { name: 'Prepare my message' }).click()
  await expect(dialog.getByText('Your message is ready. Nothing has been sent.')).toBeVisible()
})

test('motion can be paused globally and the choice survives reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Pause animations', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Resume animations' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await page.getByRole('button', { name: 'Resume animations' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on')
})

test('reduced motion preserves every section and disables WebGL and pinning', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await expect(page.locator('canvas, .pin-spacer')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Reduced motion is enabled by your device' })).toBeDisabled()
  const invisible = await page.locator('main h2').evaluateAll(headings => headings.filter(heading => {
    let node: Element | null = heading
    while (node) { if (getComputedStyle(node).opacity === '0') return true; node = node.parentElement }
    return false
  }).length)
  expect(invisible).toBe(0)
})


test('the entire homepage meets automated WCAG 2.1 AA checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(result.violations).toEqual([])
})

test('project, note, and contact dialogs meet automated accessibility checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const trigger of [page.getByRole('button', { name: 'Explore Verdant concept study' }), page.locator('.note-card').first(), page.locator('.header-contact')]) {
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(result.violations).toEqual([])
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  }
})

test.describe('mobile and touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

  test('mobile navigation, touch intent selection, and project dialogs work', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas, .pin-spacer')).toHaveCount(0)
    await page.getByRole('button', { name: 'Open navigation' }).tap()
    const navigation = page.getByRole('navigation', { name: 'Mobile navigation' })
    await expect(navigation).toBeVisible()
    await navigation.getByRole('link', { name: 'Work' }).tap()
    await expect(navigation).toHaveCount(0)
    await page.getByRole('button', { name: 'Explore Orbit concept study' }).tap()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Close dialog' }).tap()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.getByRole('tablist', { name: 'Explore search intent' }).getByRole('tab', { name: 'Take action' }).tap()
    await expect(page.getByRole('heading', { name: 'Enable action', exact: true })).toBeVisible()
  })

  test('320, 390, and 768px layouts have no horizontal overflow', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
      const offenders = await page.locator('main > section, .work-grid, .intent-interactive, .performance-wall').evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().right > innerWidth + 1).map(element => element.className))
      expect(offenders).toEqual([])
      await page.locator('.header-contact').click()
      const dialog = page.getByRole('dialog')
      expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBeTruthy()
      await page.getByRole('button', { name: 'Close dialog' }).click()
      await expect(dialog).toHaveCount(0)
    }
  })

  test('the touch layout also passes automated accessibility checks', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(result.violations).toEqual([])
  })
})
