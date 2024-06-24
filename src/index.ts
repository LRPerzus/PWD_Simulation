import { PlaywrightCrawler, Dataset } from '@crawlee/playwright';
import * as fs from 'fs-extra';
import { Page, errors } from 'playwright';


// Interfaces/Classes
interface ElementDict {
    [ElementXpath: string]: { Element: ElementInfo };
}

interface RulesBrokenDict
{
    [Type: string]: {currentElement : {
                       domRect: DOMRect|undefined,
                       windowX: number,
                       windowY: number
                    }
                    previousElement: {
                        domRect: DOMRect|undefined,
                        windowX: number,
                        windowY: number
                     }}
}

interface Dimensions {
    width: number;
    height: number;
}

interface ElementInfo {
    tagName: string | undefined;
    classList: DOMTokenList | undefined;
    id: string | undefined;
    boundsRect: DOMRect|undefined;
    xpath: string;
    nextElement?: string;
}

// Functions

// Function to create an SVG with specified dimensions
function createSvg(width: number, height: number, element:ElementInfo): string {
    console.log("WIDTH", width);
    console.log("height", height);
    // Initialize position variables
    let xPos: number = 0;
    let yPos: number = 0;
    let svgContent = "";

    // Check if element.boundsRect is defined and has required properties
    if (element.boundsRect?.x !== undefined && element.boundsRect?.y !== undefined) {
        xPos = element.boundsRect.x;
        yPos = element.boundsRect.y;

        // Create a new SVG document
        svgContent = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect x="${xPos}" y="${yPos}" width="${element.boundsRect.width}" height="${element.boundsRect.height}" fill="blue" />
        </svg>
    `;

    }

    return svgContent.trim();
}

// Function to save the SVG to a file
function saveSvgToFile(svgContent: string, fileName: number): void {
    // Specify the full file path
    const filePath = `/Users/lianglee-royjesse/PWD_Simulation/svgs_elements/${fileName}.svg`;

    // Ensure the directory exists
    const directory = "/Users/lianglee-royjesse/PWD_Simulation/svgs_elements";
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Write the SVG content to the file
    fs.writeFile(filePath, svgContent, (err) => {
        if (err) {
            console.error(`Error saving SVG file ${fileName}: ${err}`);
        } else {
            console.log(`SVG file ${fileName} saved successfully.`);
        }
    });
}
// functions saveErrorResults
function saveErrorResults(rulesbroken:RulesBrokenDict): void {
    // Specify the full file path
    const fileName = "rulesbroken"
    const filePath = `/Users/lianglee-royjesse/PWD_Simulation/RULESBROKEN/${fileName}.json`;

    // Ensure the directory exists
    const directory = "/Users/lianglee-royjesse/PWD_Simulation/RULESBROKEN";
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
     // Convert the rulesbroken object to a JSON string
     const jsonContent = JSON.stringify(rulesbroken, null, 2);

    // Write the SVG content to the file
    fs.writeFile(filePath, jsonContent, (err) => {
        if (err) {
            console.error(`Error saving SVG file ${fileName}: ${err}`);
        } else {
            console.log(`SVG file ${fileName} saved successfully.`);
        }
    });
}

// Function to capture scroll position
const getScrollPosition = async (page:Page) => {
    return await page.evaluate(() => {
        return {
            scrollX: window.scrollX,
            scrollY: window.scrollY
        };
    });
};

const ElementMoved:ElementDict = {};
const rulesbroken:RulesBrokenDict = {};
// Use https://www.dungeonmastersvault.com/ for the case where there is an illogical flow to it
// Use https://www.tech.gov.sg/ for a good test no Errors
const startUrls = ['https://www.dungeonmastersvault.com/'];

const crawler = new PlaywrightCrawler({
    launchContext: {
        launchOptions: {
            viewport: { width: 1980, height: 1080 },
        },
    },
    async requestHandler({ page, request, enqueueLinks }) {
        console.log(`Processing ${request.url}...`);
        // Ensure the viewport size is explicitly set
        await page.setViewportSize({ width: 1980, height: 1080 });

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
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        });
        
        let count = 0;
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

            // Write into SVG
            const svg:string = createSvg(dimensionsOfPage.width,dimensionsOfPage.height,focusedElement);
            saveSvgToFile(svg,count);

            ElementMoved[xpathFocus] = {Element : focusedElement};
            
            const currentScrollPosition = await getScrollPosition(page);

           if (prevousElementXpath != "") 
           {
            const previosElement = ElementMoved[prevousElementXpath].Element;
            console.log("previosElement",previosElement);
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
        // Updating the checks 
        count++;
        prevousElementXpath = xpathFocus;
        previousScrollPosition = currentScrollPosition;
        // Store the results in a dataset
        await Dataset.pushData(ElementMoved[xpathFocus]);
    }
    console.log("HEY",rulesbroken);
    saveErrorResults(rulesbroken);


    },
    maxRequestsPerCrawl: 1, // Limit the number of requests for the example
});

(async () => {
    await crawler.run(startUrls);
})();



