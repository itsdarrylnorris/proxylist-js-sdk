import puppeteer from 'puppeteer'
import ProxyList from '../index'

const googleUrl = 'https://www.google.com/search?q=hello+world&oq=hello+world'
const proxyList = new ProxyList('123', {
    included_text: "hello world",
    url: googleUrl
})

/**
 * Testing node fetch test.
 */
const nodeFetchTest = async () => {

    console.log({ proxyList })
    let response = await proxyList.proxyFetch(googleUrl, {})
    let responsePayload = await response.text()
    console.log({ responsePayload })
}


/**
 * Testing puppeteer request.
 */
const puppeteerTest = async () => {
    let oneProxy = await proxyList.getOneProxy()
    let proxyAndPort = `${oneProxy?.ip}:${oneProxy?.port}`
    console.log({ proxyAndPort })

    const browser = await puppeteer.launch({ headless: false, args: [`--proxy-server=${proxyAndPort}`] });
    const page = await browser.newPage();
    await page.goto(googleUrl);
    await page.screenshot({ path: 'example.png' });

    await browser.close();
}


// Executing the script.
nodeFetchTest()
puppeteerTest()