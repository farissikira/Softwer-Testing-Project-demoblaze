import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;
    //All pages use one general Page object 
    //playwright object for the page that is used to open urls and interact with elements


    constructor(page: Page) {
        this.page = page;
    }


    async navigate(url: string) {//to not use page.goto we use navigate method in other files
        await this.page.goto(url);
    }
}

//BasePage is used to be extended by other pages(HomePage,ProductPage,...)
