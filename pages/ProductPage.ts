import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
    readonly addToCartButton: Locator;
    readonly productName: Locator;

    constructor(page: Page) {
        super(page);

        this.addToCartButton = page.locator('a:has-text("Add to cart")');
        this.productName = page.locator('.name');
    }

    async addToCart() {
    await this.addToCartButton.click({ force: true, noWaitAfter: true });
}

    async getProductName() {
        return await this.productName.textContent();
    }
}
