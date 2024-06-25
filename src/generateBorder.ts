import { elements } from "chart.js";
import {ElementDict,Dimensions,ElementInfo,getScrollPosition,createSvg,saveSvgToFile,RulesBrokenDict,saveErrorResults} from "./common"
import { Page } from "playwright";

export async function generateDivBorder(page: Page, ElementMoved: ElementDict) {
    await page.waitForLoadState('domcontentloaded');
    console.log('Overlay tab indications');

    // Convert ElementMoved keys to an array of XPaths
    const xPathsToMove = Object.keys(ElementMoved);

    const promises = xPathsToMove.map(xpath => {
        if (ElementMoved.hasOwnProperty(xpath)) {
            const nextElementXPath = ElementMoved[xpath].Element.nextElement ?? "";

            const sendingOver = {
                current: xpath,
                next:nextElementXPath
            }
    
            return page.evaluate(sendingOver=> {
                // Function
                function createArrow(current: Element, next: Element) {
                    // Get bounding rectangles of current and next elements
                    var currentRect = current.getBoundingClientRect();
                    var nextRect = next.getBoundingClientRect();
                    
                    // Calculate center points of current and next elements
                    var currentElementCenter = {
                        x: currentRect.left + currentRect.width / 2 + window.scrollX,
                        y: currentRect.top + currentRect.height / 2 + window.scrollY
                    };
                    
                    var nextElementCenter = {
                        x: nextRect.left + nextRect.width / 2 + window.scrollX,
                        y: nextRect.top + nextRect.height / 2 + window.scrollY
                    };
                  
                    // Create SVG element
                    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("class", "purple-a11y-arrow");
                    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svg.style.position = "absolute";
                    svg.style.left = "0";
                    svg.style.top = "0";
                    const body = document.body.getBoundingClientRect();
                    svg.style.width = `${body.width}px`;
                    svg.style.height = `${body.height}px`;
                    svg.style.zIndex = `9998`;


                    // Calculate line coordinates within SVG
                    var lineX1 = currentElementCenter.x - svg.getBoundingClientRect().left;
                    var lineY1 = currentElementCenter.y - svg.getBoundingClientRect().top;
                    var lineX2 = nextElementCenter.x - svg.getBoundingClientRect().left;
                    var lineY2 = nextElementCenter.y - svg.getBoundingClientRect().top;
                  
                    // Create line element
                    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.style.zIndex = "9999";
                    line.style.position= "absolute";
                    line.setAttribute("x1", lineX1.toString());
                    line.setAttribute("y1", lineY1.toString());
                    line.setAttribute("x2", lineX2.toString());
                    line.setAttribute("y2", lineY2.toString());
                    line.setAttribute("stroke", "#39FF14");
                    line.setAttribute("stroke-width", "10");
                    line.setAttribute("marker-end", "url(#arrowhead)");
                  
                    // Create marker
                    var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
                    marker.setAttribute("id", "arrowhead");
                    marker.setAttribute("markerWidth", "10");
                    marker.setAttribute("markerHeight", "10");
                    marker.setAttribute("refX", "8");
                    marker.setAttribute("refY", "3");
                    marker.setAttribute("orient", "auto");
                    marker.setAttribute("markerUnits", "strokeWidth");
                  
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M0,0 L0,6 L9,3 z");
                    path.setAttribute("fill", "#39FF14");
                  
                    marker.appendChild(path);
                  
                    // Append line and marker to SVG
                    svg.appendChild(marker);
                    svg.appendChild(line);
                  
                    // Append SVG to the body or any desired parent element
                    document.body.appendChild(svg);
                }
                


                const result: XPathResult = document.evaluate(sendingOver.current, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const element: Node | null = result.singleNodeValue;
    
                if (element !== null && element instanceof Element) {
                    const elementProperties = element.getBoundingClientRect();
    
                    const newDiv = document.createElement('div');
                    newDiv.className = "purple-a11y-overlay";
                    newDiv.id = sendingOver.current;
                    newDiv.setAttribute("nextElement",sendingOver.next)
                    newDiv.style.width = `${elementProperties.width}px`;
                    newDiv.style.height = `${elementProperties.height}px`;
                    newDiv.style.border = '5px solid purple';
                    newDiv.style.position = 'absolute';
                    newDiv.style.left = `${elementProperties.left}px`;
                    newDiv.style.top = `${elementProperties.top}px`;
                    newDiv.style.zIndex = "9999";

                    document.body.appendChild(newDiv);

                    // Div hover events
                    newDiv.addEventListener('mouseover', () => {
                        console.log("HEY YA Mouse over");
                        const nextElementXPath = newDiv.getAttribute("nextElement") ?? "";
                        const nextElement = document.getElementById(nextElementXPath);
                        if (nextElement !== null)
                        {
                            createArrow(newDiv,nextElement)
                        }
                    });
                    newDiv.addEventListener('mouseout', () => {
                        const arrow = document.querySelector(".purple-a11y-arrow")
                        if (arrow !== null && arrow.parentNode !== null)
                        {
                            arrow.parentNode.removeChild(arrow); // Remove the arrow element
                        }
                    });
                }
                return {}; // Return an empty object or other relevant data as needed
            }, sendingOver);
        } else {
            return Promise.resolve(); // Return a resolved promise for non-own properties
        }
    });

    // Add event listener to handle window resize
    await page.evaluate((xPathsToMove) => {
        const updateDivPositions = () => {
            xPathsToMove.forEach(xpath => {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const element = result.singleNodeValue;
                const newDiv = document.getElementById(xpath);

                if (element !== null && element instanceof Element && newDiv !== null) {
                    const elementProperties = element.getBoundingClientRect();
                    if (elementProperties.width === 0 || elementProperties.height === 0)
                    {
                        console.log("HEY WHY ARE U 0?",xpath);
                        console.log("elementProperties",elementProperties);
                    }

                    // Update the position of the new div
                    newDiv.style.left = `${elementProperties.left + window.scrollX}px`;
                    newDiv.style.top = `${elementProperties.top + window.scrollY}px`;
                    newDiv.style.width = `${elementProperties.width}px`;
                    newDiv.style.height = `${elementProperties.height}px`;
                }
            });
        };

        window.addEventListener('resize', updateDivPositions);
    }, xPathsToMove);

    await Promise.all(promises);
    return; // Return statement if needed
}