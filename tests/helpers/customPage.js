const puppeteer = require('puppeteer');
const userFactory = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');
const keys = require('../../config/keys');

class CustomPage {

    constructor(page, browser) {
        this.page = page;
        this.browser = browser;
    }

    static async build() {
        const browser = await puppeteer.launch(keys.tests.puppeteerOptions);
        const page = await browser.newPage();
        const customPage = new CustomPage(page, browser);

        return new Proxy(customPage, {
            get: function(target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        });
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);
    
        await this.page.setCookie( { name: "session", value: session });
        await this.page.setCookie( { name: "session.sig", value: sig });
        await this.page.goto(`${keys.tests.targetHost}/blogs`);
        await this.page.waitFor('a[href="/auth/logout"]');
    
    }

    async close() {
        return this.browser.close();
    }
}

module.exports = CustomPage;