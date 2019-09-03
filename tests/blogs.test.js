const Page = require('./helpers/customPage');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
});


test('When logged in, can see blog create form', async () => {

    await page.login();
    await page.click('a.btn-floating.btn-large.red');

    const titleLabel = await page.$eval('form .title label', label => label.innerText);
    const contentLabel = await page.$eval('form .content label', label => label.innerText);

    expect(titleLabel).toEqual('Blog Title');
    expect(contentLabel).toEqual('Content');

});