import { chromium, Browser, Page, BrowserContext } from 'playwright';
import {ElementDict,Dimensions,ElementInfo,getScrollPosition,createSvg,saveSvgToFile,RulesBrokenDict,saveErrorResults} from "./common"
import {tabsItems} from './tabItems'

export const DEBUG = false;

async function run() {
    // Launch Chromium browser
    const browser = await chromium.launch({
        args: ['--window-size=1920,1040'],
        headless: false,
        channel: 'chrome',
        // bypassCSP: true,
        devtools: DEBUG,
      });
    
    // Create a new browser context
    const context: BrowserContext = await browser.newContext();
    const ElementMoved:ElementDict = {};
    const rulesbroken:RulesBrokenDict = {};

    // Detection of new page
    context.on('page', async newPage => {
        await tabsItems(newPage,ElementMoved,rulesbroken);
        });
    ;
    // Create a new page
    const page: Page = await context.newPage();

    // Navigate to a URL (replace with your desired URL)
    await page.goto('https://www.tech.gov.sg/', { waitUntil: 'domcontentloaded' });
    
    // Wait until browser context is closed
    await new Promise<void>(resolve => {
        page.on('close', () => {
            console.log('Context closed.');
            resolve();
        });
    });

    // Close the browser
    await browser.close();
}

// Run the function
run().catch(console.error);
