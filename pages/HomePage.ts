import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly propertyCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.propertyCards = page.locator('[data-testid="property-card"]'); // adjust later
  }

  async navigate() {
    await this.page.goto('/');
  }

  async expectListingVisible() {
    await expect(this.propertyCards.first()).toBeVisible();
  }
}