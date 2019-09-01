const puppeteer = require('puppeteer');

let browser;
let page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterEach(() => {
    browser.close();
});

test('Adds two numbers', () => {
    const sum = 3 + 5;
    expect(sum).toEqual(8);
});

test('The header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('clicking "login" starts oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {

    const userId = "5d61a52db8268d09dce5bcce";
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: userId
        }
    };
    const sessionBase64String = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const Keygrip = require('keygrip');
    const keys = require('../config/keys.js');
    const keygrip = new Keygrip([keys.cookieKey]);
    const signature = keygrip.sign('session=' + sessionBase64String);

    await page.setCookie( { name: "session", value: sessionBase64String });
    await page.setCookie( { name: "session.sig", value: signature });

    await page.goto('localhost:3000');

    await page.waitFor('a[href="/auth/logout"]');
    const logoutCaption = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

    expect(logoutCaption).toEqual('Logout');

});