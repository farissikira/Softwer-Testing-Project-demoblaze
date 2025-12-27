

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('Smoke', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.openHomePage();
    });

    test('ST01 - Home page loads successfully', async ({ page }) => {
        const home = new HomePage(page);

        await expect(home.productLinks.first()).toBeVisible();

        const productCount = await home.productLinks.count();
        expect(productCount).toBeGreaterThan(0);
    });

    test('ST02 - Login modal opens successfully', async ({ page }) => {
        const home = new HomePage(page);
        const login = new LoginPage(page);

        await home.openLoginModal();

        await expect(login.usernameInput).toBeVisible();
        await expect(login.passwordInput).toBeVisible();
        await expect(login.loginButton).toBeVisible();
    });

    test('ST03 - Categories load succesfully', async ({ page }) => {
        const home = new HomePage(page);

        const clickCategoryAndVerifyProducts = async (categoryName: string) => {
            await page.locator('a.list-group-item', { hasText: categoryName }).click();

            await expect(home.productLinks.first()).toBeVisible();

            const productCount = await home.productLinks.count();
            expect(productCount).toBeGreaterThan(0);
        };

        await clickCategoryAndVerifyProducts('Phones');
        await clickCategoryAndVerifyProducts('Laptops');
        await clickCategoryAndVerifyProducts('Monitors');
    });

    test('ST04 - product details page opens successfully', async ({ page }) => {
        const home = new HomePage(page);
        const product = new ProductPage(page);

        const productName = 'Nexus 6';

        await home.selectProductByName(productName);

        await expect(product.productName).toBeVisible();
        await expect(product.productName).toHaveText(new RegExp(productName, 'i'));

        const price = page.locator('.price-container');
        await expect(price).toBeVisible();

        const image = page.locator('#imgp img, .item img, img.img-fluid').first();
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('src', /.+/);
    });

    test('ST05 - Add to cart works successfully', async ({ page }) => {
        const home = new HomePage(page);
        const product = new ProductPage(page);

        const productName = 'Nexus 6';

        await home.selectProductByName(productName);

        await expect(product.productName).toBeVisible();
        await expect(product.productName).toHaveText(new RegExp(productName, 'i'));

        const dialogPromise = page.waitForEvent('dialog');
        await product.addToCart();

        const dialog = await dialogPromise;
        expect(dialog.message()).toMatch(/Product added/i);
        await dialog.accept();
    });

    test('ST06 - Cart page opens successfully', async ({ page }) => {
        const cart = new CartPage(page);

        await cart.openCart();

        await expect(page).toHaveURL(/\/cart\.html$/);
        await expect(cart.placeOrderButton).toBeVisible();
    });
});
