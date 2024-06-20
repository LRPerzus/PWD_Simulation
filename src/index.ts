import { PlaywrightCrawler, Dataset } from '@crawlee/playwright';
import * as fs from 'fs-extra';


// Interfaces/Classes
interface ElementDict {
    [ElementXpath: string]: { Element: object };
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

const ElementMoved:ElementDict = {};

const startUrls = ['https://www.tech.gov.sg/'];

const crawler = new PlaywrightCrawler({
    async requestHandler({ page, request, enqueueLinks }) {
        await page.setViewportSize({ width: 1980, height: 1080 });
        console.log(`Processing ${request.url}...`);
        const title = await page.title();
        const content = await page.content();

        let activeElementTagName: string | undefined = '';

        // The whole page currently
        const dimensionsOfPage:Dimensions = await page.evaluate(() => {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        });
        
        let count = 0;

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
            count++;

            console.log('Focused Element:', ElementMoved[xpathFocus].Element);

            // Store the results in a dataset
        }
        await Dataset.pushData({ ElementMoved });

    },
    maxRequestsPerCrawl: 1, // Limit the number of requests for the example
});

(async () => {
    await crawler.run(startUrls);
})();


