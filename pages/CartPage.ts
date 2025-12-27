
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly placeOrderButton: Locator;

    readonly nameInput: Locator;
    readonly countryInput: Locator
    readonly cityInput: Locator;
    readonly cardInput: Locator
    readonly monthInput: Locator;
    readonly yearInput: Locator;

    constructor(page: Page) {
        super(page);

        this.cartItems = page.locator('.success td:nth-child(2)');
        this.placeOrderButton = page.locator('button:has-text("Place Order")');

        this.nameInput = page.locator('#name');
        this.countryInput = page.locator('#country');
        this.cityInput = page.locator('#city');
        this.cardInput = page.locator('#card');
        this.monthInput = page.locator('#month');
        this.yearInput = page.locator('#year');
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

    async fillPlaceOrderForm(details: { name: string, country: string, city: string, card: string, month: string, year: string }) {
        await this.page.locator('#name').fill(details.name);
        await this.page.locator('#country').fill(details.country);
        await this.page.locator('#city').fill(details.city);
        await this.page.locator('#card').fill(details.card);
        await this.page.locator('#month').fill(details.month);
        await this.page.locator('#year').fill(details.year);
        await this.page.locator('button:has-text("Purchase")').click({ force: true, noWaitAfter: true });
    }

    async removeItemFromCart(itemName: string) {
        const itemRow = this.page.locator('.success', { hasText: itemName });
        const deleteLink = itemRow.locator('a:has-text("Delete")');
        await deleteLink.click();
    }
}
