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
  included_text: string | null | undefined
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
  constructor(privateKey: string, proxyListConfig: ProxyConfig | null | undefined) {
    this.privateKey = privateKey
    this.proxyListConfig = {
      url: '',
      included_text: '',
    }

    if (proxyListConfig && proxyListConfig.url && proxyListConfig.included_text) {
      this.proxyListConfig = proxyListConfig

      // Small URL validatoin
      if (!this.stringIsAValidUrl(proxyListConfig.url)) {
        throw new Error(`This is not a valid url. ${proxyListConfig.url}`)
      }
    }

    this.findProxies()
  }

  /**
   * Get first proxy you find.
   */
  async getOneProxy(): Promise<ProxyListInterface | null> {
    let proxies = await this.getProxies()
    return proxies && proxies[0] ? proxies[0] : null
  }

  /**
   * Get list of all proxies
   */
  async getProxies(): Promise<ProxyListInterface[] | []> {
    if (!this.proxyList.length) {
      await this.findProxies()
    }
    return this.proxyList.length ? this.proxyList : []
  }

  /**
   * Fetch all proxies
   */
  async findProxies() {
    let url = `${this.proxyListUrl}`

    // Adding url
    if (this.proxyListConfig.url) {
      url = `${url}?url=${encodeURIComponent(this.proxyListConfig.url)}`
    }

    // If we have the includes paramater let's add it.
    if (this.proxyListConfig.url && this.proxyListConfig.included_text) {
      url = `${url}&included_text=${encodeURIComponent(this.proxyListConfig.included_text)}`
    }

    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.privateKey}`,
      },
    })

    this.proxyList = await response.json()

    return this.proxyList
  }

  /**
   * URl Validator
   * @param s
   */
  stringIsAValidUrl = (s: string): boolean => {
    try {
      new URL(s)
      return true
    } catch (err) {
      return false
    }
  }

  /**
   * Proxy Fetch
   * @param url
   * @param param1
   */
  async proxyFetch(url: string, { ...arg }): Promise<any> {
    let proxy = await this.getOneProxy()

    if (!proxy) {
      throw new Error('Could not find a proxy')
    }

    let agent = new HttpsProxyAgent(`http://${proxy.ip}:${proxy.port}`)
    const userAgent = new UserAgent()

    let fetchArg = {
      ...arg,
      ...{
        agent,
        headers: {
          'User-Agent': userAgent.toString(),
        },
      },
    }

    // @ts-ignore
    let originResponse = await fetch(url, fetchArg)
    return originResponse
  }
}

export default ProxyList
