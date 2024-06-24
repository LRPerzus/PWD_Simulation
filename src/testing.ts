import { chromium, Browser, BrowserContext, Page, Route } from 'playwright';

async function run() {
    // Launch Chromium browser
    const browser: Browser = await chromium.launch();
    
    // Create a new browser context
    const context: BrowserContext = await browser.newContext();
    
    // Create a new page
    const page: Page = await context.newPage();

    // Navigate to a URL (replace with your desired URL)
    await page.goto('https://www.tech.gov.sg/');

    // Define a request handler function
    async function requestHandler(route: Route) {
        // Print the requested URL
        console.log('Request intercepted:', route.request().url());

        // Continue with the request
        await route.continue();
    }


    // Setup request interception for all requests
    await page.route('**', route => route.continue());

    // Keep the browser window open
    await new Promise(() => {});

    // Close the browser
    await browser.close();
}

// Run the function
run().catch(console.error);
