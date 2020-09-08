# ProxyList JS SDK

## Installation
**With Yarn:**
```bash
$ yarn add proxylist-js-sdk
```
**With NPM:**
```bash
$ npm install proxylist-js-sdk
```

## Examples

### Searching "Hello World" in Google using proxyFetch()

```javascript
import ProxyList from 'proxylist-js-sdk'

const googleUrl = 'https://www.google.com/search?q=hello+world&oq=hello+world'
const proxyList = new ProxyList('123', {
    included_text: "hello world",
    url: googleUrl
})

/**
 * Testing node fetch test.
 */
const nodeFetchTest = async () => {
    let response = await proxyList.proxyFetch(googleUrl, {})
    let responsePayload = await response.text()
    console.log({ responsePayload })
}

// Executing the script.
nodeFetchTest()
```

### Searching "Hello World" in Google using puppeteer

```javascript
import ProxyList from 'proxylist-js-sdk'
import puppeteer from 'puppeteer'

/**
 * Testing puppeteer request.
 */
const puppeteerTest = async () => {

    const googleUrl = 'https://www.google.com/search?q=hello+world&oq=hello+world'
    const proxyList = new ProxyList('123', {
        included_text: "hello world",
        url: googleUrl
    })

    let oneProxy = await proxyList.getOneProxy()
    let proxyAndPort = `${oneProxy?.ip}:${oneProxy?.port}`

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=${proxyAndPort}`] });
    const page = await browser.newPage();
    await page.goto(googleUrl);
    await page.screenshot({ path: 'example.png' });

    await browser.close();
}


puppeteerTest()
```
