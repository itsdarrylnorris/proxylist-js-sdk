interface ProxyListInterface {
    ip: string;
    port: number;
    protocol: string;
    country: string;
    source: string;
    anonymity_level: string;
    expire_time: number;
}
interface ProxyConfig {
    url: string;
    included_text: string | null | undefined;
}
declare class ProxyList {
    private proxyListUrl;
    private privateKey;
    private proxyListConfig;
    private proxyList;
    constructor(privateKey: string, proxyListConfig: ProxyConfig);
    getOneProxy(): Promise<ProxyListInterface | null>;
    getProxies(): Promise<ProxyListInterface[] | []>;
    findProxies(): Promise<void>;
    stringIsAValidUrl: (s: string) => boolean;
    proxyFetch(url: string, { ...arg }: {
        [x: string]: any;
    }): Promise<any>;
}
export default ProxyList;
