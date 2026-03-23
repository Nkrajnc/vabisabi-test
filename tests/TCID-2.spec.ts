import { test, expect, Locator, Page } from '@playwright/test';
import { closePopupIfPresent, getListingCards } from '../utils/pageHelpers';

/**
 * Test Case ID 2: Filter by "Pisarna" shows only matching property cards
 *
 * This test verifies that the property type filter functionality works correctly.
 * When filtering by "Pisarna" (Office), only office properties should be displayed
 * in the results, ensuring the filter logic is applied properly.
 */
test('Filter by "Pisarna" shows only matching property cards', async ({ page }) => {
  // Navigate to the Ljubljana property listings page
  await page.goto('/ljubljana');

  // Handle any initial popup that might appear
  await closePopupIfPresent(page);

  // Verify we're on the correct page
  await expect(page).toHaveTitle(/BTC city|Estate/i);

  // Get initial listing cards before filtering
  const listingCards = getListingCards(page);

  // Verify we have listings to filter
  const initialCount = await listingCards.count();
  expect(initialCount, 'No listing cards before filtering').toBeGreaterThan(0);

  console.log(`Initial listing count: ${initialCount}`);

  // Open the property type filter dropdown
  await page.getByRole('button', { name: 'Namembnost' }).click();

  // Select "Pisarna" (Office) from the filter options
  await page.getByRole('menuitem', { name: 'Pisarna' }).click();

  // Wait for the filter to be applied and results to update
  await expect(async () => {
    const newCount = await listingCards.count();
    expect(newCount).not.toBe(initialCount);
  }).toPass();

  // Get the count of filtered results
  const filteredCount = await listingCards.count();
  console.log(`Filtered listing count: ${filteredCount}`);

  // Ensure we have results after filtering
  expect(filteredCount, 'No results after applying filter').toBeGreaterThan(0);

  // Validate that ALL displayed cards match the "Pisarna" filter
  for (let i = 0; i < filteredCount; i++) {
    const card = listingCards.nth(i);

    // Get the card title
    const title = card.locator('h6 span.capitalize').first();
    await expect(title, `Card #${i} missing title`).toBeVisible();

    // Verify the title exactly matches "Pisarna"
    const text = (await title.innerText()).trim();

    expect(
      text,
      `Card #${i} does not match filter (expected "Pisarna")`
    ).toBe('Pisarna');
  }
});