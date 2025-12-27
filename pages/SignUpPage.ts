import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signupButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#sign-username');
        this.passwordInput = page.locator('#sign-password');
        this.signupButton = page.locator('button:has-text("Sign up")');
    }

    async signup(username: string, password: string) {
        await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signupButton.click({ force: true, noWaitAfter: true });
    }
}
