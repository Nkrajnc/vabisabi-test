import { Locator, expect, Page } from '@playwright/test';

/**
 * Asserts that a locator is both visible and contains non-empty text content.
 * This is a common validation pattern for UI elements that should display meaningful content.
 *
 * @param locator - The Playwright Locator to validate
 * @param message - Descriptive message for test failure reporting
 */
export async function expectNonEmpty(locator: Locator, message: string): Promise<void> {
  await expect(locator, message).toBeVisible();
  await expect(locator, message).not.toHaveText(/^\s*$/);
}

/**
 * Validates that a property card displays either a valid image or an appropriate placeholder.
 * Checks for the presence of an image element, and if not found, ensures a placeholder SVG exists.
 * Also verifies that image alt text is not visible (indicating failed image load).
 *
 * @param card - The property card locator to validate
 * @param message - Descriptive message for test failure reporting
 */
export async function expectImageOrPlaceholder(card: Locator, message: string): Promise<void> {
  await card.scrollIntoViewIfNeeded();

  const media = card.locator(
    '.relative.overflow-hidden.w-full.h-\\[180px\\]'
  ).first();

  await expect(media, `${message} - missing media container`).toBeVisible();

  const text = await media.innerText();

  expect(
    text.includes('Naslovna fotografija'),
    `${message} - alt text visible → image failed to render`
  ).toBe(false);

  const image = media.locator('img').first();

  if (await image.count()) {
    await expect(image, `${message} - image not visible`).toBeVisible();
    return;
  }

  const placeholder = media.locator('svg').first();
  await expect(
    placeholder,
    `${message} - missing both image and placeholder`
  ).toBeVisible();
}

/**
 * Validates that a property card's title matches the content displayed on its detail page.
 * First checks the main heading, then falls back to searching through property parts list.
 * This ensures navigation from listing to detail page shows the correct property.
 *
 * @param page - The Playwright Page instance (should be on detail page)
 * @param cardTitle - The title text from the listing card
 * @param message - Descriptive message for test failure reporting
 */
export async function expectTypeMatchesDetail(
  page: Page,
  cardTitle: string,
  message: string
): Promise<void> {
  const normalizedCardTitle = cardTitle.trim().toLowerCase();

  // 1. First try main detail heading
  const mainHeading = page.locator('h1, h2').filter({ hasText: cardTitle }).first();

  if (await mainHeading.count()) {
    await expect(mainHeading, `${message} - main detail heading mismatch`).toBeVisible();
    return;
  }

  // 2. Fallback: structured "property parts" list
  const propertyPartsSection = page.locator('.mt-6.mb-12').first();
  await expect(
    propertyPartsSection,
    `${message} - property parts section missing`
  ).toBeVisible();

  const propertyParts = propertyPartsSection.locator('li');
  const partCount = await propertyParts.count();

  expect(partCount, `${message} - property parts list is empty`).toBeGreaterThan(0);

  let matched = false;

  for (let i = 0; i < partCount; i++) {
    const partText = ((await propertyParts.nth(i).innerText()) || '').trim().toLowerCase();

    if (partText.includes(normalizedCardTitle)) {
      matched = true;
      break;
    }
  }

  expect(
    matched,
    `${message} - card title not found in main heading or property parts list`
  ).toBe(true);
}
