import puppeteer from 'puppeteer'
import ProxyList from '../index'

const googleUrl = 'https://www.google.com/search?ei=iz9XX9KrI9m50PEPvdaxoAk&q=hello+world&oq=hello+world&gs_lcp=CgZwc3ktYWIQAzIFCAAQkQIyBQgAEJECMgIIADIFCC4QsQMyAgguMgUIABCxAzIFCAAQsQMyBQgAELEDMgIIADICCAA6BAgAEEc6BAgAEEM6BAguEEM6CAguEJECEJMCUKpCWPlGYPNHaABwAngAgAG6AogB0AWSAQcwLjEuMS4xmAEAoAEBqgEHZ3dzLXdpesABAQ&sclient=psy-ab&ved=0ahUKEwiSnf7qkNnrAhXZHDQIHT1rDJQQ4dUDCAw&uact=5'
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