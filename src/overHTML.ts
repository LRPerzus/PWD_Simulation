import { chromium, Browser, Page, BrowserContext } from 'playwright';
import {ElementDict,Dimensions,ElementInfo,getScrollPosition,createSvg,saveSvgToFile,RulesBrokenDict,saveErrorResults} from "./common"
import { Dataset } from '@crawlee/playwright';

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
    
    // Create a new page
    const page: Page = await context.newPage();

    // Navigate to a URL (replace with your desired URL)
    await page.goto('https://www.tech.gov.sg/');

    const ElementMoved:ElementDict = {};
    const rulesbroken:RulesBrokenDict = {};

    async function tabsItems() {
        // Ensure the viewport size is explicitly set
        await page.setViewportSize({ width: 1200, height: 1080});

        // Verify viewport size with null check
        const viewportSize = await page.viewportSize();
        if (viewportSize) {
            console.log(`Viewport size: ${viewportSize.width}x${viewportSize.height}`);
        } else {
            console.log(`Viewport size is not set.`);
        }
        
        let activeElementTagName: string | undefined = '';

        // The whole page currently
        const dimensionsOfPage:Dimensions = await page.evaluate(() => {
            return {
                width: document.body.getBoundingClientRect().width,
                height: document.body.getBoundingClientRect().height
            };
        });

        console.log("dimensionsOfPage",dimensionsOfPage);
        
        let count = 0;
        let previosElement:ElementInfo;
        let prevousElementXpath = ""
        let previousScrollPosition = {
            scrollX:0,
            scrollY:0
        };

        while (activeElementTagName !== 'BODY')
        {
            await page.keyboard.press('Tab');
            console.log("Tab Pressed")

            // Using playwright it writes code into the DOM of the website I think I am not too sure cause I cannot console.log
            const focusedElement = await page.evaluate(() => {
                // Get the XPath of the element
                const getXPath = (element: Element | null): string => {
                    if (!element) return '';
                
                    let xPath = '';
                    let currentElement: Element | null = element;
                
                    while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
                        let index = 1;
                        let sibling = currentElement.previousElementSibling;
                
                        // Count preceding siblings with the same tag name
                        while (sibling) {
                            if (sibling.tagName === currentElement.tagName) {
                                index++;
                            }
                            sibling = sibling.previousElementSibling;
                        }
                
                        const tagName = currentElement.tagName.toLowerCase();
                        const id = `[${index}]`;
                        xPath = '/' + tagName + id + xPath;
                
                        currentElement = currentElement.parentNode as Element | null;
                    }
                
                    return xPath;
                };

                const Element:Element | null = document.activeElement;
                const outputElement:ElementInfo = {
                    tagName : Element?.tagName,
                    classList : Element?.classList,
                    id: Element?.id,
                    boundsRect : Element?.getBoundingClientRect(),
                    xpath: getXPath(Element),
                }
                return outputElement;
            });
            const currentScrollPosition = await getScrollPosition(page);
            focusedElement.window = currentScrollPosition;

            activeElementTagName = focusedElement?.tagName;

            // When it reaches the end it goes back to the searchBar
            if(activeElementTagName === 'BODY')
            {
                break;
            }
            const xpathFocus = focusedElement.xpath;

            // if when we tab it goes back to the same element. AKA a tab trap or it goes back to an element
            if (xpathFocus === "" || ElementMoved[xpathFocus])
            {
                console.log("MOVED to an already recored Element");
                console.log("Might be stuck in a trap/endless loop")
                break;
            }

            
            ElementMoved[xpathFocus] = {Element : focusedElement};
            
           if (prevousElementXpath != "") 
           {
            const previosElement = ElementMoved[prevousElementXpath].Element;
            // console.log("previosElement",previosElement);
            // Write into SVG
            const svg:string = createSvg(dimensionsOfPage.width,dimensionsOfPage.height,focusedElement,previosElement);
            saveSvgToFile(svg,count);

            const previousElementBoundRect = previosElement.boundsRect;


                // X need to be increaseing
                // Y also needs to be increasing as well
                // To see if it is logical 

                if (previousElementBoundRect?.x !== undefined &&
                    focusedElement.boundsRect?.x !== undefined &&
                    previousElementBoundRect?.y !== undefined &&
                    focusedElement.boundsRect?.y !== undefined &&
                    // IF the x pos or the y pos relative to the screen view is increasing
                    // OR
                    // the screen has scrolled down
                    (focusedElement.boundsRect.x > previousElementBoundRect.x ||
                    focusedElement.boundsRect.y > previousElementBoundRect.y || 
                    currentScrollPosition.scrollX > previousScrollPosition.scrollX ||
                    currentScrollPosition.scrollY > previousScrollPosition.scrollY
                    )
                )
                {
                    console.log("X",focusedElement.boundsRect.x > previousElementBoundRect.x)
                    console.log("Y", focusedElement.boundsRect.y > previousElementBoundRect.y)                
                    console.log("Good Order") 

                }
                else
                {
                    
                    rulesbroken[previosElement.xpath] = {
                        currentElement:{
                            domRect:focusedElement.boundsRect,
                            windowX:currentScrollPosition.scrollX,
                            windowY:currentScrollPosition.scrollY,
                        },
                        previousElement:{
                            domRect:previosElement.boundsRect,
                            windowX:previousScrollPosition.scrollX,
                            windowY:previousScrollPosition.scrollY,
                        }
                    }
                    console.log("NOT LOCIGAL ORDER FROM LEFT TO RIGHT, UP TO DOWN")
                }
            }
            else{
                // Write into SVG
                const emptyElement: ElementInfo = {
                    tagName: undefined,
                    classList: undefined,
                    id: undefined,
                    boundsRect: undefined,
                    xpath: '',
                    nextElement: undefined,
                    window: {
                        scrollX: 0,
                        scrollY: 0,
                    },
                };

                const svg:string = createSvg(dimensionsOfPage.width,dimensionsOfPage.height,focusedElement,emptyElement);
                saveSvgToFile(svg,count);
            }
        // Updating the checks 
        count++;
        prevousElementXpath = xpathFocus;
        previousScrollPosition = currentScrollPosition;
        // Store the results in a dataset
        await Dataset.pushData(ElementMoved[xpathFocus]);
    }
    saveErrorResults(rulesbroken);


    }
    tabsItems();

    // Keep the browser window open
    await new Promise(() => {});
    
    // Close the browser
    await browser.close();
}

// Run the function
run().catch(console.error);
