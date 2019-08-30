const puppeteer = require('puppeteer');

test('Adds two numbers', () => {
    const sum = 3 + 5;
    expect(sum).toEqual(8);
});

test('We can launch a broswer', async () => {
    const broswer = await puppeteer.launch({
        headless: false
    });
    const page = await broswer.newPage();
    await page.goto('localhost:3000');

    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});

