import { PlaywrightCrawler, Dataset } from '@crawlee/playwright';


interface ElementDict {
    [ElementXpath: string]: { Element: object };
}

const ElementMoved:ElementDict = {};

const startUrls = ['https://www.tech.gov.sg/'];a

const crawler = new PlaywrightCrawler({
    async requestHandler({ page, request, enqueueLinks }) {
        console.log(`Processing ${request.url}...`);
        const title = await page.title();
        const content = await page.content();

        let activeElementTagName: string | undefined = '';

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

                return {
                    tagName : Element?.tagName,
                    classList : Element?.classList,
                    id: Element?.id,
                    boundsRect : Element?.getBoundingClientRect(),
                    xpath: getXPath(Element),
                };
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

            ElementMoved[xpathFocus] = {Element : focusedElement};

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
