"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const proxy_agent_1 = __importDefault(require("proxy-agent"));
const url_1 = require("url");
const user_agents_1 = __importDefault(require("user-agents"));
class ProxyList {
    constructor(privateKey, proxyListConfig) {
        this.proxyListUrl = 'https://s86uac8upl.execute-api.us-east-2.amazonaws.com/default/proxy-finder';
        this.proxyList = [];
        this.stringIsAValidUrl = (s) => {
            try {
                new url_1.URL(s);
                return true;
            }
            catch (err) {
                return false;
            }
        };
        this.privateKey = privateKey;
        this.proxyListConfig = proxyListConfig;
        if (!this.stringIsAValidUrl(proxyListConfig.url)) {
            throw new Error(`This is not a valid url. ${proxyListConfig.url}`);
        }
        this.findProxies();
    }
    getOneProxy() {
        return __awaiter(this, void 0, void 0, function* () {
            let proxies = yield this.getProxies();
            return proxies && proxies[0] ? proxies[0] : null;
        });
    }
    getProxies() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.proxyList.length) {
                yield this.findProxies();
            }
            return this.proxyList.length ? this.proxyList : [];
        });
    }
    findProxies() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this.proxyListUrl}?url=${encodeURIComponent(this.proxyListConfig.url)}`;
            if (this.proxyListConfig.included_text) {
                url = `${url}&included_text=${encodeURIComponent(this.proxyListConfig.included_text)}`;
            }
            let response = yield node_fetch_1.default(url, {
                headers: {
                    'Authorization': `Bearer ${this.privateKey}`,
                },
            });
            this.proxyList = yield response.json();
        });
    }
    proxyFetch(url, _a) {
        var arg = __rest(_a, []);
        return __awaiter(this, void 0, void 0, function* () {
            let proxy = yield this.getOneProxy();
            if (!proxy) {
                throw new Error("Could not find a proxy");
            }
            let agent = new proxy_agent_1.default(`http://${proxy.ip}:${proxy.port}`);
            const userAgent = new user_agents_1.default();
            let fetchArg = Object.assign(Object.assign({}, arg), {
                agent,
                headers: {
                    'User-Agent': userAgent.toString(),
                },
            });
            let originResponse = yield node_fetch_1.default(url, fetchArg);
            return originResponse;
        });
    }
}
exports.default = ProxyList;
//# sourceMappingURL=index.js.map