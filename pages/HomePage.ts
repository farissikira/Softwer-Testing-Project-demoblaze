import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly loginButton: Locator;
    readonly signupButton: Locator;
    readonly productLinks: Locator;

    readonly phonesCategory: Locator;
    readonly laptopsCategory: Locator
    readonly monitorsCategory: Locator;

    constructor(page: Page) {
        super(page);

        this.loginButton = page.locator('#login2');//goal that tests do not use locator directly instead through this objects of type Locator 
        this.signupButton = page.locator('#signin2');
        this.productLinks = page.locator('.card-title a');

        this.phonesCategory = page.locator('a:has-text("Phones")');
        this.laptopsCategory = page.locator('a:has-text("Laptops")');
        this.monitorsCategory = page.locator('a:has-text("Monitors")');
    }

    async openHomePage() {
        await this.navigate('https://www.demoblaze.com/');
    }

    async openLoginModal() {
        await this.loginButton.click({ force: true });
        // Wait for modal to be visible
        await this.page.locator('#logInModal').waitFor({ state: 'visible', timeout: 10000 });
    }

    async openSignupModal() {
        await this.signupButton.click({ force: true });
        await this.page.locator('#signInModal').waitFor({ state: 'visible', timeout: 10000 });
    }

    async selectProductByName(name: string) {
        await this.page.locator(`a:has-text("${name}")`).click();
    }       

    async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
        if (category === 'Phones') {
            await this.phonesCategory.click();
        } else if (category === 'Laptops') {
            await this.laptopsCategory.click();
        } else if (category === 'Monitors') {
            await this.monitorsCategory.click();
        }
        await this.page.locator('.card-title').first().waitFor({ state: 'visible', timeout: 5000 });
    }

    async sendContactMessage(email: string, name: string, message: string) {
        await this.page.locator('a:has-text("Contact")').click();
        await this.page.locator('#recipient-email').fill(email);    
        await this.page.locator('#recipient-name').fill(name);    
        await this.page.locator('#message-text').fill(message);    
        await this.page.locator('button:has-text("Send message")').click();
    }

    
    async goToNextPage() {
      const next = this.page.locator('#next2');
      await next.waitFor({ state: 'visible' }); // ensure it's visible before clicking
      await next.click();
    }

    async goToPreviousPage() {
        const prev = this.page.locator('#prev2');
        await prev.waitFor({ state: 'visible' });
        await prev.click();
    }

}
//method they are used to open home page, login modal, signup modal, select product by name