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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const index_1 = __importDefault(require("../index"));
const googleUrl = 'https://www.google.com/search?ei=iz9XX9KrI9m50PEPvdaxoAk&q=hello+world&oq=hello+world&gs_lcp=CgZwc3ktYWIQAzIFCAAQkQIyBQgAEJECMgIIADIFCC4QsQMyAgguMgUIABCxAzIFCAAQsQMyBQgAELEDMgIIADICCAA6BAgAEEc6BAgAEEM6BAguEEM6CAguEJECEJMCUKpCWPlGYPNHaABwAngAgAG6AogB0AWSAQcwLjEuMS4xmAEAoAEBqgEHZ3dzLXdpesABAQ&sclient=psy-ab&ved=0ahUKEwiSnf7qkNnrAhXZHDQIHT1rDJQQ4dUDCAw&uact=5';
const proxyList = new index_1.default('123', {
    included_text: "hello world",
    url: googleUrl
});
const puppeteerTest = () => __awaiter(void 0, void 0, void 0, function* () {
    let oneProxy = yield proxyList.getOneProxy();
    let proxyAndPort = `${oneProxy === null || oneProxy === void 0 ? void 0 : oneProxy.ip}:${oneProxy === null || oneProxy === void 0 ? void 0 : oneProxy.port}`;
    console.log({ proxyAndPort });
    const browser = yield puppeteer_1.default.launch({ headless: false, args: [`--proxy-server=${proxyAndPort}`] });
    const page = yield browser.newPage();
    yield page.goto(googleUrl);
    yield page.screenshot({ path: 'example.png' });
});
puppeteerTest();
//# sourceMappingURL=index.js.map