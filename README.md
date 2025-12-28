# Demoblaze E-commerce Test Automation
This project contains automated end-to-end tests for the [Demoblaze](https://www.demoblaze.com/) e-commerce website using Playwright and TypeScript.

## Table of Contents
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Page Object Model](#page-object-model)
- [Viewing Test Reports](#viewing-test-reports)
- [CI/CD Configuration](#cicd-configuration)
- [Troubleshooting](#troubleshooting)

## Project Structure
```
.
├── pages/                      # Page Object Model classes
│   ├── BasePage.ts            # Base class for all pages
│   ├── CartPage.ts            # Cart page interactions
│   ├── HomePage.ts            # Home page interactions
│   ├── LoginPage.ts           # Login modal interactions
│   ├── ProductPage.ts         # Product details page interactions
│   └── SignUpPage.ts          # Sign up modal interactions
├── tests/                      # Test specifications
│   ├── functional.spec.ts     # Functional test cases (TC01-TC16)
│   └── smoke.spec.ts          # Smoke test cases (ST01-ST06)
├── test-results/              # Test execution results
├── playwright-report/         # HTML test reports
├── .gitignore                 # Git ignore configuration
├── package.json               # Project dependencies
├── playwright.config.ts       # Playwright configuration
└── README.md                  # This file
```

## Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)
Check your installations:
```bash
node --version
npm --version
```

## Installation
1. **Clone or download the project** (if not already done)
2. **Navigate to the project directory**
```bash
cd Softwer-Testing-Project-demoblaze
```
3. **Install dependencies**
```bash
npm install
```
4. **Install Playwright browsers**
```bash
npx playwright install
```
This will download Chromium, Firefox, and WebKit browsers required for testing.

## Running Tests
### Run All Tests
```bash
npx playwright test
```
### Run Specific Test Suite
Run only smoke tests:
```bash
npx playwright test tests/smoke.spec.ts
```
Run only functional tests:
```bash
npx playwright test tests/functional.spec.ts
```
### Run Specific Test Case
```bash
npx playwright test -g "TC01"
```
### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```
### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```
### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```
### Debug a Specific Test
```bash
npx playwright test --debug -g "TC01"
```

## Test Suites
### Smoke Tests (tests/smoke.spec.ts)

Quick validation tests to ensure basic functionality:

- **ST01**: Home page loads successfully
- **ST02**: Login modal opens successfully
- **ST03**: Categories load successfully
- **ST04**: Product details page opens successfully
- **ST05**: Add to cart works successfully
- **ST06**: Cart page opens successfully

### Functional Tests (tests/functional.spec.ts)

Comprehensive end-to-end test scenarios:

- **TC01**: User login with valid credentials
- **TC02**: Login fails with invalid credentials
- **TC03**: Attempt login with empty fields
- **TC04**: User sign up
- **TC05**: Sign up fails with existing username
- **TC06**: Add product to cart
- **TC07**: Remove product from cart
- **TC08**: Complete order placement
- **TC09**: Attempt order with incomplete form
- **TC10**: Category selection functionality
- **TC11**: Contact form sends message
- **TC12**: Cart total price calculation validation
- **TC13**: Logout and session reset check
- **TC14**: Cart persistence after refresh
- **TC15**: Block add to cart if not logged in
- **TC16**: Attempt purchase with empty cart

## 🏗️ Page Object Model

The project uses the Page Object Model (POM) design pattern for better maintainability:

### [BasePage](pages/BasePage.ts)
Base class extended by all page objects. Provides common navigation functionality.

### [HomePage](pages/HomePage.ts)
- Open home page
- Open login/signup modals
- Select products and categories
- Send contact messages
- Navigate between pages

### [LoginPage](pages/LoginPage.ts)
- Fill login credentials
- Submit login form

### [SignupPage](pages/SignUpPage.ts)
- Fill signup credentials
- Submit signup form

### [ProductPage](pages/ProductPage.ts)
- Add products to cart
- Get product details

### [CartPage](pages/CartPage.ts)
- View cart items
- Place orders
- Fill order form
- Remove items from cart

## 📊 Viewing Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This will open an interactive HTML report in your browser showing:
- Test results (passed/failed)
- Execution time
- Screenshots and videos (on failure)
- Detailed test steps

## ⚙️ CI/CD Configuration

The project is configured for CI/CD environments via [playwright.config.ts](playwright.config.ts):

- **Retries**: 2 retries on CI, 0 locally
- **Workers**: 1 worker on CI (sequential), parallel locally
- **Reporter**: HTML reports generated automatically
- **Trace**: Captured on first retry for debugging

### Environment Variables

- `CI`: Set to `true` in CI environments to enable CI-specific settings

## 🐛 Troubleshooting

### Tests are failing randomly

This might be due to timing issues. The tests already include appropriate waits, but you can increase timeouts in [playwright.config.ts](playwright.config.ts):

```typescript
use: {
  timeout: 60000, // Increase test timeout
  navigationTimeout: 30000, // Increase navigation timeout
}
```

### Browser installation issues

If browsers fail to install, try:

```bash
npx playwright install --force
```

### Clear test artifacts

Remove previous test results and reports:

```bash
# Windows
rmdir /s /q test-results playwright-report

# Linux/Mac
rm -rf test-results playwright-report
```

### Debugging failed tests

1. Run test in headed mode: `npx playwright test --headed`
2. Use debug mode: `npx playwright test --debug`
3. Check traces in the HTML report
4. Review screenshots in `test-results/` directory

### Common Issues

**Issue**: Tests fail with "Cannot read properties of null"
- **Solution**: Ensure the demoblaze website is accessible and elements are loading

**Issue**: Dialog assertions fail
- **Solution**: The website uses native JavaScript alerts. Ensure dialog listeners are set up before actions that trigger them

**Issue**: Cart persistence issues
- **Solution**: Tests use `beforeEach` and `afterEach` hooks to clear storage. Check that these hooks are executing properly

## 📞 Support

For issues or questions:
1. Check existing test results in the HTML report
2. Review error context in [test-results/](test-results/) directory
3. Run tests with `--debug` flag for step-by-step execution
