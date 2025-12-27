
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignUpPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { time } from 'node:console';

test.describe('Functional Tests', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let signupPage: SignupPage;
  let cartPage: CartPage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page, context }) => {
    // Test isolation: clear cookies and storage before each test
    await context.clearCookies();

    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);

    await homePage.openHomePage();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('TC01 - Verify user can log in with valid credentials (Positive)', async ({ page }) => {
    await homePage.openLoginModal();
    await loginPage.login('username', 'password');

    await expect(page.locator('#nameofuser')).toHaveText('Welcome username');
  });

  test('TC02 - Verify login fails with invalid credentials (Negative)', async ({ page }) => {
    await homePage.openLoginModal();

    const dialogPromise = page.waitForEvent('dialog');
    await loginPage.login('this_user_does_not_exist', 'wrongPassword');

    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('User does not exist.');
    await dialog.accept();
  });

  test('TC03 - Attempt login with empty fields (Negative)', async ({ page }) => {
    await homePage.openLoginModal();

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Please fill out Username and Password.');
      await dialog.dismiss();
    });

    await loginPage.login('', '');
  });

  test('TC04 - Verify user can sign up (Positive)', async ({ page }) => {
    const uniqueUsername = `user${Date.now()}`;

    await homePage.openSignupModal();

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Sign up successful.');
      await dialog.dismiss();
    });

    await signupPage.signup(uniqueUsername, 'validPassword123');
  });

  test('TC05 - Verify sign up fails with existing username (Negative)', async ({ page }) => {
    await homePage.openSignupModal();

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('This user already exists.');
      await dialog.dismiss();
    });

    await signupPage.signup('username', 'password');
  });

  test('TC06 - Add product to cart', async ({ page }) => {
    const productName = 'Nexus 6';

    await homePage.selectProductByName(productName);

    await expect(productPage.productName).toBeVisible();
    await expect(productPage.productName).toHaveText(new RegExp(productName, 'i'));

    const dialogPromise = page.waitForEvent('dialog');
    await productPage.addToCart();

    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Product added/i);
    await dialog.accept();

    await cartPage.openCart();

    const cartItem = page.locator('tr').filter({ hasText: productName });
    await expect(cartItem).toBeVisible();
  });

  test('TC07 - Remove product from cart', async ({ page }) => {
    const productName = 'Nexus 6';

    await homePage.selectProductByName(productName);

    await expect(productPage.productName).toBeVisible();
    await expect(productPage.productName).toHaveText(new RegExp(productName, 'i'));

    const addDialogPromise = page.waitForEvent('dialog');
    await productPage.addToCart();

    const addDialog = await addDialogPromise;
    expect(addDialog.message()).toMatch(/Product added/i);
    await addDialog.accept();

    await cartPage.openCart();

    await cartPage.removeItemFromCart(productName);

    const cartItem = page.locator('tr').filter({ hasText: productName });
    await expect(cartItem).not.toBeVisible();
  });

  test('TC08 - Place an order (Positive)', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    const category: 'Phones' | 'Laptops' | 'Monitors' = 'Laptops';
    const productName = 'Sony vaio i5';

    const purchaseDetails = {
      name: 'MUJKE Tester',
      country: 'Bosnia',
      city: 'Vogosca',
      card: '1234567890',
      month: '12',
      year: '2025',
    };

    await homePage.openHomePage();
    await homePage.selectCategory(category);
    await homePage.selectProductByName(productName);

    const openedProductName = (await productPage.getProductName())?.trim();
    expect(openedProductName).toContain(productName);

    const dialogPromise = page.waitForEvent('dialog');
    await productPage.addToCart();

    const dialog = await dialogPromise;
    await dialog.accept();

    await cartPage.openCart();

    const cartCells = page.locator('.success td:nth-child(2)');
    await expect(cartCells).not.toHaveCount(0);
    await expect(page.locator('.success td:nth-child(2)', { hasText: productName })).toBeVisible();

    await cartPage.placeOrder();
    await page.locator('#orderModal').waitFor({ state: 'visible', timeout: 10000 });

    await cartPage.fillPlaceOrderForm(purchaseDetails);

    const confirmation = page.locator('.sweet-alert');
    await expect(confirmation).toBeVisible();
    await expect(confirmation.locator('h2')).toHaveText(/Thank you for your purchase!/i);

    const detailsText = await confirmation.locator('p').textContent();
    expect(detailsText).toBeTruthy();
    expect(detailsText!).toMatch(/Amount:\s*\d+(\.\d+)?\s*USD/i);
    expect(detailsText!).toMatch(new RegExp(`Name:\\s*${purchaseDetails.name}`, 'i'));

    await confirmation.locator('button.confirm').click();

    await cartPage.openCart();
    const countAfter = await cartPage.getItemsCount();
    expect(countAfter).toBe(0);
  });

  test('TC09 - Attempt to place an order with incomplete form (Negative)', async ({ page }) => {
    const productName = 'Nexus 6';

    await homePage.selectProductByName(productName);

    const addAlertPromise = page.waitForEvent('dialog');
    await productPage.addToCart();

    const addAlert = await addAlertPromise;
    await addAlert.accept();

    await cartPage.openCart();
    await cartPage.placeOrder();

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Please fill out Name and Creditcard.');
      await dialog.accept();
    });

    await cartPage.fillPlaceOrderForm({
      name: '',
      country: '',
      city: '',
      card: '',
      month: '',
      year: '',
    });

    await expect(page.locator('.modal-title:has-text("Place order")')).toBeVisible();
  });

  test('TC10 - Verify category selection functionality (Positive)', async ({ page }) => {
    await homePage.selectCategory('Laptops');
    await expect(page.locator('.card-title a', { hasText: 'Sony vaio i5' })).toBeVisible();

    await homePage.selectCategory('Monitors');
    await expect(page.locator('.card-title a', { hasText: 'Apple monitor 24' })).toBeVisible();

    await homePage.selectCategory('Phones');
    await expect(page.locator('.card-title a', { hasText: 'Samsung galaxy s6' })).toBeVisible();
  });

  test('TC11 - Contact form sends message (Positive)', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Thanks for the message!!');
      await dialog.dismiss();
    });

    await homePage.sendContactMessage('test@test.com', 'MUJKE', 'Testing TC11');

    await expect(page.locator('#exampleModal')).not.toBeVisible();
  });

  test('TC12 - Validate cart Total Price Calculation', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    const parsePrice = (text: string | null) => {
      const cleaned = (text ?? '').replace(/[^\d]/g, '');
      return cleaned ? Number(cleaned) : 0;
    };

    const productsToAdd = ['Nexus 6', 'Samsung galaxy s6'];

    for (const productName of productsToAdd) {
      await homePage.openHomePage();
      await homePage.selectProductByName(productName);

      await expect(productPage.productName).toBeVisible();
      await expect(productPage.productName).toHaveText(new RegExp(productName, 'i'));

      const addDialogPromise = page.waitForEvent('dialog');
      await productPage.addToCart();

      const dialog = await addDialogPromise;
      await dialog.accept();
    }

    await cartPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(productsToAdd.length);

    const priceCells = page.locator('.success td:nth-child(3)');
    const priceTexts = await priceCells.allTextContents();
    const expectedTotal = priceTexts.reduce((sum, text) => sum + parsePrice(text), 0);

    const totalLocator = await page.locator('#totalp');
    await expect(totalLocator).not.toHaveText('', { timeout: 15000 });

    const totalText = await totalLocator.textContent();
    const actualTotal = parsePrice(totalText);

    expect(actualTotal).toBe(expectedTotal);
  });

  test('TC13 - Logout + refresh + reopen keeps user logged out (Session reset check)', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    const username = 'username';
    const password = 'password';

    await homePage.openHomePage();
    await homePage.openLoginModal();
    await loginPage.login(username, password);

    const welcome = page.locator('#nameofuser');

    await expect(welcome).toBeVisible();
    await expect(welcome).toContainText(username);

    const logoutButton = page.locator('#logout2');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    await expect(welcome).not.toBeVisible();
    await expect(homePage.loginButton).toBeVisible();

    await page.reload();

    await expect(welcome).not.toBeVisible();
    await expect(homePage.loginButton).toBeVisible();

    await homePage.openHomePage();

    await expect(welcome).not.toBeVisible();
    await expect(homePage.loginButton).toBeVisible();
  });

  test('TC14 - Ensure cart persists after refresh', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    const productName = 'Nexus 6';

    await homePage.openHomePage();
    await homePage.selectProductByName(productName);

    await expect(productPage.productName).toBeVisible();
    await expect(productPage.productName).toHaveText(new RegExp(productName, 'i'));

    const addDialogPromise = page.waitForEvent('dialog');
    await productPage.addToCart();

    const dialog = await addDialogPromise;
    await dialog.accept();

    await cartPage.openCart();

    const cartItem = page.locator('tr.success').filter({ hasText: productName });
    await expect(cartItem).toBeVisible();

    await page.reload();

    await expect(cartItem).toBeVisible();
  });

  test('TC15 - Block add to cart if not logged in (Negative)', async ({ page }) => {
    test.fail(true, 'Spec expects add to cart blocked when not logged in, but DemoBlaze allows it.');

    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await homePage.openHomePage();

    const productName = 'Nexus 6';

    await homePage.selectProductByName(productName);
    await expect(productPage.productName).toBeVisible();

    const dialogPromise = page.waitForEvent('dialog');
    await productPage.addToCart();

    const dialog = await dialogPromise;
    expect(dialog.message()).toMatch(/Please log in to add items to your cart/i);
    await dialog.accept();
  });

  test('TC16 - Attempt purchase cart is empty', async ({ page }) => {
    test.fail(true, 'Spec expects purchase blocked when cart is empty, but DemoBlaze allows it.');

    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);

    await homePage.openHomePage();
    await cartPage.openCart();

    const itemsCount = await cartPage.getItemsCount();
    expect(itemsCount).toBe(0);

    await cartPage.placeOrder();

    await cartPage.fillPlaceOrderForm({
      name: 'MUJKE Tester',
      country: 'Bosnia',
      city: 'Vogosca',
      card: '1234567890',
      month: '12',
      year: '2025',
    });

    const errorMessage = page.locator('.modal-title:has-text("No items in cart")');
    await expect(errorMessage).toBeVisible();

    await page.locator('button:has-text("OK")').click({ timeout: 10000 });
  });

  test.afterEach(async ({ page, context }) => {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await context.clearCookies();
  });
});
