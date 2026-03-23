import { test, expect, Locator, Page } from '@playwright/test';
import { closePopupIfPresent } from '../utils/pageHelpers';
import { expectNonEmpty, expectImageOrPlaceholder } from '../utils/testHelpers';

/**
 * Test Case ID 1: Verify all property listings on BTC Estate render correctly
 *
 * This test ensures that every property card on the Ljubljana listings page
 * displays all required elements and content properly. It validates the
 * structural integrity and data completeness of property listings.
 */
test('Verify all property listings on BTC Estate render correctly', async ({ page }) => {
  // Navigate to the Ljubljana property listings page
  await page.goto('/ljubljana');

  // Handle any initial popup that might appear
  await closePopupIfPresent(page);

  // Verify we're on the correct page
  await expect(page).toHaveTitle(/BTC city|Estate/i);

  // Locate all property listing cards on the page
  const listingCards = page.locator(
    '.relative.divide-y.divide-gray-200.flex.flex-shrink-0.flex-col.items-center.group.border-none.h-full'
  ).filter({
    has: page.locator('span.text-gray-600.line-clamp-3')
  });

  // Ensure we have at least one listing card
  const cardCount = await listingCards.count();
  expect(cardCount, 'No listing cards found').toBeGreaterThan(0);

  console.log(`Found ${cardCount} listing cards. Starting verification...`);

  // Validate each property card individually
  for (let i = 0; i < cardCount; i++) {
    const card = listingCards.nth(i);
    await card.scrollIntoViewIfNeeded();

    // Verify card has a non-empty title
    const title = card.locator('h6 span.capitalize').first();
    await expectNonEmpty(title, `Card #${i} missing or empty title`);

    // Verify card has the required blue badge indicator
    await expect(
      card.locator('.bg-btcprimary').first(),
      `Card #${i} missing primary blue badge`
    ).toBeVisible();

    // Verify card displays either a valid image or placeholder
    await expectImageOrPlaceholder(card, `Card #${i} invalid image`);

    // Verify the information section structure
    const infoSection = card.locator('.mb-2.flex.items-start.justify-between.gap-x-4').first();
    await expect(infoSection, `Card #${i} missing info section`).toBeVisible();

    // Validate the layout has correct number of info rows
    const leftInfoRows = infoSection.locator('.flex.flex-col.gap-y-2 > span');
    const rightInfoRows = infoSection.locator(':scope > span');

    await expect(leftInfoRows, `Card #${i} should have 2 left-side info rows`).toHaveCount(2);
    await expect(rightInfoRows, `Card #${i} should have 1 right-side info row`).toHaveCount(1);

    // Verify card has meaningful description text
    const description = card.locator('span.text-gray-600.line-clamp-3').first();
    await expectNonEmpty(description, `Card #${i} missing or empty description`);

    // Ensure description has substantial content
    const textContent = await description.innerText();
    expect(
      textContent.trim().length,
      `Card #${i} description is too short`
    ).toBeGreaterThan(1);
  }
});