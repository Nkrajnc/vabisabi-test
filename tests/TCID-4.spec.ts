import { test, expect } from '@playwright/test';
import { closePopupIfPresent, getListingCards } from '../utils/pageHelpers';

/**
 * Test Case ID 4: Applying restrictive filters shows empty state
 *
 * This test verifies that when multiple restrictive filters are applied
 * simultaneously, resulting in no matching properties, the application
 * displays an appropriate empty state message instead of showing
 * irrelevant or broken content.
 */
test.describe('@smoke', () => {
  test('Applying restrictive filters shows empty state', async ({ page }) => {
    // Navigate to the Ljubljana property listings page
    await page.goto('/ljubljana');
    await closePopupIfPresent(page);

    // Verify we have initial listings before applying filters
    const listingCards = getListingCards(page);
    const initialCount = await listingCards.count();
    expect(initialCount, 'Expected listings before filtering').toBeGreaterThan(0);

    // Apply first filter: Property type → Storage (Skladišče)
    await page.getByRole('button', { name: 'Namembnost' }).click();
    await page.getByRole('menuitem', { name: 'Skladišče' }).click();

    // Apply second filter: Building → Kristalna palača
    await page.getByRole('button', { name: 'Stavba' }).click();
    await page.getByRole('menuitem', { name: 'Kristalna palača' }).click();

    // Wait for the filters to be applied and results to update
    await expect(async () => {
      const newCount = await listingCards.count();
      expect(newCount).not.toBe(initialCount);
    }).toPass();

    // Verify no listing cards remain after applying restrictive filters
    await expect(listingCards).toHaveCount(0);

    // Verify empty state message is displayed
    const emptyState = page.locator('.col-span-full.flex.flex-col.items-start.gap-1');
    await expect(emptyState).toBeVisible();

    // Verify the empty state contains the expected messages
    await expect(emptyState).toContainText('Noben prostor ne ustreza izbranim filtrom.');
    await expect(emptyState).toContainText(
      'Oddajte povpraševanje in pomagali vam bomo najti primeren prostor.'
    );
  });
});