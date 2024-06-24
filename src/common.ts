import * as fs from 'fs-extra';
import { Page } from 'playwright';


// Interfaces/Classes
export interface ElementDict {
    [ElementXpath: string]: { Element: ElementInfo };
}

export interface RulesBrokenDict
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

export interface Dimensions {
    width: number;
    height: number;
}

export interface ElementInfo {
    tagName: string | undefined;
    classList: DOMTokenList | undefined;
    id: string | undefined;
    boundsRect: DOMRect|undefined;
    xpath: string;
    nextElement?: string;
    window?: {
        scrollX:number,
        scrollY:number,
    }
}

// Functions

// Function to calculate the center of a rectangle
export function getRectCenter(element:ElementInfo,xPos:number,yPos:number) {
   
    const width= element.boundsRect?.width ?? 0;
    const height = element.boundsRect?.height?? 0;

    return {
        x: xPos + width / 2,
        y: yPos + height / 2
    };
}

// Function to create an SVG with specified dimensions
export function createSvg(width: number, height: number, element:ElementInfo, previosElement:ElementInfo): string {
    console.log("WIDTH", width);
    console.log("Height", height);
    // Initialize position variables
    let xPos: number = 0;
    let yPos: number = 0;
    let svgContent = "";

    // Check if element.boundsRect is defined and has required properties
    if (element.boundsRect?.x !== undefined 
        && element.boundsRect?.y !== undefined
        && element.window?.scrollX !== undefined 
        && element.window?.scrollY !== undefined
        ){

        // Current Element
        xPos = element.boundsRect.x + element.window.scrollX ;
        yPos = element.boundsRect.y + element.window.scrollY;
        const currentElementCenter = getRectCenter(element,xPos,yPos);
        
        if (previosElement.boundsRect !== undefined)
        {
            // Previous Element
            const previousXPos = (previosElement.boundsRect?.x ?? 0) + (previosElement.window?.scrollX ?? 0);
            const previousYPos = (previosElement.boundsRect?.y ?? 0) + (previosElement.window?.scrollY ?? 0);
            const previousElementCenter = getRectCenter(previosElement,previousXPos,previousYPos);

            // Create SVG content
            svgContent = `
                <!-- ${element.xpath} -->
                <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                    <rect x="${xPos}" y="${yPos}" width="${element.boundsRect.width}" height="${element.boundsRect.height}" fill="green" />
                    <rect x="${previousXPos}" y="${previousYPos}" width="${previosElement.boundsRect.width}" height="${previosElement.boundsRect.height}" fill="red" />
                    <line x1="${previousElementCenter.x}" y1="${previousElementCenter.y}" x2="${currentElementCenter.x}" y2="${currentElementCenter.y}" stroke="black" stroke-width="2" marker-end="url(#arrowhead)" />
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="black" />
                    </marker>
                </svg>
            `;
        }
        else{
            // Create SVG content
            svgContent = `
                <!-- ${element.xpath} -->
                <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                    ${element && element.boundsRect? ` <rect x="${xPos}" y="${yPos}" width="${element.boundsRect.width}" height="${element.boundsRect.height}" fill="green" />
                    ` : ''}
                </svg>
            `;
        }
    }
    

    return svgContent.trim();
}

// Function to save the SVG to a file
export function saveSvgToFile(svgContent: string, fileName: number): void {
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
export function saveErrorResults(rulesbroken:RulesBrokenDict): void {
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
export const getScrollPosition = async (page:Page) => {
    return await page.evaluate(() => {
        return {
            scrollX: window.scrollX,
            scrollY: window.scrollY
        };
    });
};

