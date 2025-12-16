import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly loginButton: Locator;
    readonly signupButton: Locator;
    readonly productLinks: Locator;

    constructor(page: Page) {
        super(page);

        this.loginButton = page.locator('#login2');//goal that tests do not use locator directly instead through this objects of type Locator 
        this.signupButton = page.locator('#signin2');
        this.productLinks = page.locator('.card-title a');
    }

    async openHomePage() {
        await this.navigate('https://www.demoblaze.com/');
    }

    async openLoginModal() {
        await this.loginButton.click();
    }

    async openSignupModal() {
        await this.signupButton.click();
    }

    async selectProductByName(name: string) {
        await this.page.locator(`text=${name}`).click();
    }
}
//method they are used to open home page, login modal, signup modal, select product by name