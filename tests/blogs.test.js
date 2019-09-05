const Page = require('./helpers/customPage');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
});


describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating.btn-large.red');
    });

    test('Can see blog create form', async () => {
    
        const titleLabel = await page.$eval('form .title label', label => label.innerText);
        const contentLabel = await page.$eval('form .content label', label => label.innerText);
    
        expect(titleLabel).toEqual('Blog Title');
        expect(contentLabel).toEqual('Content');
    
    });

    test('Using invalid inputs the form shows an error message', async () => {
        await page.click('form button[type="submit"]');
        const titleError = await page.$eval("div.title .red-text", e => e.innerText);
        const contentError = await page.$eval("div.content .red-text", e => e.innerText);

        expect(titleError).toEqual('You must provide a value');
        expect(contentError).toEqual('You must provide a value');
    });


    describe('And using valid inputs', async() => {

        let myTitleInput = "My Blog's Title";
        let myContentInput = "My Blog's Content";

        beforeEach(async () => {
            await page.type('form input[name="title"]', myTitleInput);
            await page.type('form input[name="content"]', myContentInput);
            await page.click('form button[type="submit"]');
        });

        test('Submitting takes user to review screen', async () => {
            const confirmText = await page.$eval('form > *:first-child', e => e.innerText);

            const titleValue = await page.$eval('form > div:nth-of-type(1) > div', e => e.innerText);
            const contentValue = await page.$eval('form > div:nth-of-type(2) > div', e => e.innerText);
            expect(confirmText).toEqual("Please confirm your entries");
            expect(titleValue).toEqual(myTitleInput);
            expect(contentValue).toEqual(myContentInput);
        });
        
        test('Submitting then saving adds blog to index page', async () => {
            await page.click('form button.green');

            await page.waitFor('div.card');

            const cardTitle = await page.$eval('.card-title', e => e.innerText);
            const cardContent = await page.$eval('.card-title + p', e => e.innerText);

            expect(cardTitle).toEqual(myTitleInput);
            expect(cardContent).toEqual(myContentInput);

        });
    });
});


describe('User is not logged in', async () => {

    test('User cannot create blog posts', async () => {

        const result = await page.evaluate(() => {
            return fetch('/api/blogs', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'My Fetch()',
                    content: 'My Content created through Javascript Fetch()'
                })
            }).then(response => response.json());
        });

        expect(result).toEqual({ error: 'You must log in!' });

    });

    test('User cannot see blog list', async () => {

        const result = await page.evaluate(() => {

            return fetch('/api/blogs', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json());

        });

        expect(result).toEqual({ error: 'You must log in!' });

    });
});