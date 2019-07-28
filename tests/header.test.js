
const Page = require('./helpers/page');

let page;

beforeEach( async () => {
    jest.setTimeout(30000);
    page = await Page.build();

    await page.goto('http://localhost:3000');
});

afterEach( async () => {
    //await browser.close();
});

test('checks the header of the browser appears correctly', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('clicking on login button starts oauth flow', async () => {
    const el = await page.click('.right a');
    const url = await page.url();
    
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When login is clicked, logout button appears', async () => {
    await page.login();

    const text = await page.getContentsOf('a[href="/auth/logout"]');

    expect(text).toEqual('Logout');
});
