const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    jest.setTimeout(30000);
    page = await Page.build();
    await page.goto('http://localhost:3000');

});

afterEach(async () => {
    //await page.close();
});



describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('shows the blog creation form', async () => {

        const text = await page.getContentsOf('form label');
    
        expect(text).toEqual('Blog Title');
    });

    describe('enters valid form inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My blog');
            await page.type('.content input', 'My content');
            await page.click('form button');
        });

        test('takes to the review screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('after reviewing takes to the blog page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            
            const textTitle = await page.getContentsOf('.card-title');
            const textContent = await page.getContentsOf('p');

            expect(textTitle).toEqual('My blog');
            expect(textContent).toEqual('My content');
        });
    })

    describe('enters invalid form inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('Shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        }); 
    });

});

describe('When not logged in', async () => {

    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            body: {
                title: 'T',
                'content': 'M'
            }
        }
    ]

    test('not able to create a blog post', async () => {
        const result = await page.post('/api/blogs', {title: 'new blog', content: 'new content'});
        expect(result).toEqual({error: 'You must log in!'})
    });

    test('user can not get a list of blogs', async () => {
        const result = await page.get('/api/blogs');
        expect(result).toEqual({error: 'You must log in!'});
    });

    test('actions related to blog are prohibited', async () => {
        const results = await page.execRequests(actions);

        for(result of results) {
            expect(result).toEqual({error: 'You must log in!'});
        }
    })
});

