import { test, expect, Page, Locator } from '@playwright/test';
import { closePopupIfPresent, getListingCards } from '../utils/pageHelpers';

/**
 * Test Case ID 5: Back navigation preserves applied filter (Skladišče)
 *
 * This test verifies that when a user applies a filter, navigates to a
 * property detail page, and then uses the browser back button or "back"
 * link, the applied filter remains active and the filtered results are
 * still displayed. This ensures a good user experience by maintaining
 * the user's current search context.
 */
test('Back navigation preserves applied filter (Skladišče)', async ({ page }) => {
  // Navigate to the Ljubljana property listings page
  await page.goto('/ljubljana');
  await closePopupIfPresent(page);

  // Get listing cards locator
  const listingCards = getListingCards(page);

  // Apply filter: Property type → Storage (Skladišče)
  await page.getByRole('button', { name: 'Namembnost' }).click();
  await page.getByRole('menuitem', { name: 'Skladišče' }).click();

  // Wait for filtered results to load
  await expect(listingCards.first()).toBeVisible();

  // Verify we have filtered results
  const filteredCount = await listingCards.count();
  expect(filteredCount, 'Expected filtered results').toBeGreaterThan(0);

  // Verify all displayed cards match the "Skladišče" filter
  for (let i = 0; i < filteredCount; i++) {
    const card = listingCards.nth(i);

    const title = card.locator('h6 span.capitalize').first();
    await expect(title).toContainText('Skladišče');
  }

  // Navigate to the first filtered property's detail page
  const firstCard = listingCards.first();
  await firstCard.click();

  // Verify we successfully navigated away from the listings page
  await expect(page).not.toHaveURL(/ljubljana$/);

  // Use the "Nazaj" (Back) button to return to listings
  const backButton = page.getByRole('button', { name: 'Nazaj' });

  // Fallback selector if the role-based selector fails
  const backFallback = page.locator(
    '.items-center.rounded-full.py-3.flex.font-medium.link.gap-x-2'
  );

  // Try the primary back button, fall back to alternative selector
  if (await backButton.isVisible().catch(() => false)) {
    await backButton.click();
  } else {
    await backFallback.first().click();
  }

  // Verify we returned to the listings page
  await expect(page).toHaveURL(/ljubljana/);

  // Verify the filter is still applied after navigation
  await expect(listingCards.first()).toBeVisible();

  // Verify we still have filtered results
  const afterBackCount = await listingCards.count();
  expect(afterBackCount).toBeGreaterThan(0);

  // Verify all cards still match the "Skladišče" filter after back navigation
  for (let i = 0; i < afterBackCount; i++) {
    const card = listingCards.nth(i);

    const title = card.locator('h6 span.capitalize').first();
    await expect(title).toContainText('Skladišče');
  }
});