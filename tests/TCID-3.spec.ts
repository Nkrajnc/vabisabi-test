import { test, expect } from '@playwright/test';
import { closePopupIfPresent, getListingCards } from '../utils/pageHelpers';
import { expectNonEmpty } from '../utils/testHelpers';

/**
 * Normalizes a string by removing all non-digit characters.
 */
function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Test Case ID 3: All property cards open correct detail pages with valid content
 */
test.describe('@smoke', () => {
  test('All property cards open correct detail pages with valid content', async ({ page }) => {
    await page.goto('/ljubljana');

    await closePopupIfPresent(page);
    await expect(page).toHaveTitle(/BTC city|Estate/i);

    const listingCards = getListingCards(page);
    const count = await listingCards.count();

    expect(count, 'No listing cards found').toBeGreaterThan(0);
    console.log(`Testing ${count} listing cards`);

    for (let i = 0; i < count; i++) {
      const card = listingCards.nth(i);
      await card.scrollIntoViewIfNeeded();

      // --- CARD DATA ---
      const titleLocator = card.locator('h6 span.capitalize').first();
      await expectNonEmpty(titleLocator, `Card #${i} missing title`);

      const areaLocator = card.locator('text=/\\d[\\d.,\\s]*\\s*m²/').first();
      await expect(areaLocator, `Card #${i} missing area`).toBeVisible();

      const cardAreaText = ((await areaLocator.innerText()) || '').trim();
      const cardAreaDigits = normalizeDigits(cardAreaText);

      expect(cardAreaDigits, `Card #${i} invalid area`).not.toBe('');

      const descriptionLocator = card.locator('span.text-gray-600.line-clamp-3').first();
      await expectNonEmpty(descriptionLocator, `Card #${i} missing description`);

      const oldUrl = page.url();

      // --- NAVIGATION ---
      await card.click();
      await expect(page, `Card #${i} did not navigate`).not.toHaveURL(oldUrl);

      // --- DETAIL PAGE ---

      const detailContent = page.locator('.bg-white.border-b.order-1.lg\\:order-2').first();
      await expect(detailContent, `Card #${i} missing detail content`).toBeVisible();

      const detailHeading = detailContent.locator('h2').first();
      await expect(detailHeading, `Card #${i} missing detail heading`).toBeVisible();

      const detailHeadingText = ((await detailHeading.innerText()) || '').trim();
      const detailHeadingDigits = normalizeDigits(detailHeadingText);

      expect(
        detailHeadingDigits.includes(cardAreaDigits),
        `Card #${i} area mismatch (card: ${cardAreaText}, heading: ${detailHeadingText})`
      ).toBe(true);

      // --- DESCRIPTION ---
      const detailDescription = detailHeading.locator('xpath=following::p[1]').first();
      await expect(detailDescription, `Card #${i} missing detail description`).toBeVisible();

      const descText = (await detailDescription.innerText()).trim();
      expect(descText.length, `Card #${i} description too short`).toBeGreaterThan(20);

      // --- IMAGE ---
      const detailImage = page.getByRole('img', {
        name: 'Velika fotografija prostora'
      });

      await expect(detailImage, `Card #${i} missing detail image`).toBeVisible();

      // --- CTA ---
      const ctaSection = page.locator('.lg\\:px-6.px-4.py-12.border-b.bg-gray-50');
      await expect(ctaSection, `Card #${i} missing CTA section`).toBeVisible();

      // --- BACK ---
      await page.goBack();
      await expect(getListingCards(page).first()).toBeVisible();
    }
  });
});