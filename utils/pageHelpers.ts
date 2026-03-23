import { Locator, Page } from '@playwright/test';

/**
 * Closes the popup dialog if it is currently visible on the page.
 * This function safely checks for the presence of a popup close button
 * and clicks it if found, handling cases where the popup may not exist.
 *
 * @param page - The Playwright Page instance to interact with
 */
export async function closePopupIfPresent(page: Page): Promise<void> {
  const closePopupButton = page.locator(
    'button.Button-module__oQGfeG__small.Button-module__oQGfeG__secondary'
  );

  if (await closePopupButton.isVisible().catch(() => false)) {
    await closePopupButton.click();
  }
}

/**
 * Returns a locator for property listing cards on the page.
 * Filters cards to ensure they contain description text to avoid
 * matching other similar elements.
 *
 * @param page - The Playwright Page instance
 * @returns Locator for property listing cards
 */
export function getListingCards(page: Page): Locator {
  return page.locator(
    '.relative.divide-y.divide-gray-200.flex.flex-shrink-0.flex-col.items-center.group.border-none.h-full'
  ).filter({
    has: page.locator('span.text-gray-600.line-clamp-3')
  });
}