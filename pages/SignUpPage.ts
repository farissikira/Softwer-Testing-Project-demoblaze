/*Ali. Mozes a i ne moras ukloniti ovaj file iz pages foldera. Ovo je cisto
da mozes preko testa registrovat usera da bi mogli login se. A mozemo i manuelno na stranici 
registrovat usera pa onda samo testom logovat.Kako hoces et il pozivaj ovaj file preko testa 
ili manuelno cemo registrovat.

*/
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
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signupButton.click();

    }
}
