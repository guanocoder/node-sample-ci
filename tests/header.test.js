const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
});

afterAll(() => {
    browser.close();
});

test('Adds two numbers', () => {
    const sum = 3 + 5;
    expect(sum).toEqual(8);
});

test('We can launch a broswer', async () => {

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');

});

