import fetch from 'node-fetch'
import HttpsProxyAgent from 'proxy-agent'
import { URL } from 'url'
import UserAgent from 'user-agents'

interface ProxyListInterface {
  ip: string
  port: number
  protocol: string
  country: string
  source: string
  anonymity_level: string
  expire_time: number
}

interface ProxyConfig {
  url: string
  includes: string | null | undefined
}

/**
 * ProxyList Class
 */
class ProxyList {

  /**
   * ProxyList API URL
   */
  private proxyListUrl: string = 'https://s86uac8upl.execute-api.us-east-2.amazonaws.com/default/proxy-finder'

  /**
   * Private Key
   */
  private privateKey: string

  /**
   * Proxy List Config.
   */
  private proxyListConfig: ProxyConfig

  /**
   * Proxy Lists.
   */
  private proxyList: ProxyListInterface[] = []

  /**
   * Constructor
   */
  constructor(privateKey: string, proxyListConfig: ProxyConfig) {
    this.privateKey = privateKey
    this.proxyListConfig = proxyListConfig

    // Small URL validatoin
    if (!this.stringIsAValidUrl(proxyListConfig.url)) {
      throw new Error(`This is not a valid url. ${proxyListConfig.url}`)
    }

    this.findProxies()
  }

  /**
   * Get first proxy you find.
   */
  async getOneProxy(): Promise<string> {
    let proxies = await this.getProxies()
    return proxies && proxies[0] && proxies[0].ip ? proxies[0].ip : ''
  }

  /**
   * Get list of all proxies
   */
  async getProxies(): Promise<ProxyListInterface[] | []> {
    if (!this.proxyList.length) {
      await this.findProxies()
    }
    return !this.proxyList.length ? this.proxyList : []
  }

  /**
   * Fetch all proxies
   */
  async findProxies() {
    let url = `${this.proxyListUrl}?url=${this.proxyListConfig.url}`

    // If we have the includes paramater let's add it.
    if (this.proxyListConfig.includes) {
      url = `${url}&includes=${this.proxyListConfig.includes}`
    }
    let response = await fetch(url, {
      headers: {
        'Authorization Bearer': this.privateKey,
      },
    })

    this.proxyList = await response.json()
  }

  /**
   * URl Validator
   * @param s 
   */
  stringIsAValidUrl = (s: string): boolean => {
    try {
      new URL(s);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Proxy Fetch
   * @param url 
   * @param param1 
   */
  async proxyFetch(url: string, { ...arg }) {
    let proxy = this.getOneProxy()
    let agent = HttpsProxyAgent(proxy)
    const userAgent = new UserAgent()

    let fetchArg = {
      ...arg, ...{
        agent,
        headers: {
          'User-Agent': userAgent.toString(),
        },
      }
    }

    // Fetching the website
    // @ts-ignore
    let originResponse = await fetch(url, fetchArg)
  }
}

export default ProxyList