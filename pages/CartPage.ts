import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);

        this.cartItems = page.locator('.success td:nth-child(2)');
        this.placeOrderButton = page.locator('button:has-text("Place Order")');
    }

    async openCart() {
        await this.navigate('https://www.demoblaze.com/cart.html');
    }

    async getItemsCount() {
        return await this.cartItems.count();
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }
}
