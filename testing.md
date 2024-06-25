# Scan Issue Details
Details of each issue and severity rating provided by the current scan engine.

## Table Of Contents
- [Scan Issue Details](#scan-issue-details)
  - [Table Of Contents](#table-of-contents)
  - [Conformance Covered](#conformance-covered)
  - [WCAG 2.0 Level A](#wcag-20-level-a)
  - [WCAG 2.0 Level AA](#wcag-20-level-aa)
  - [WCAG 2.2 Level AA](#wcag-22-level-aa)
  - [Best Practice](#best-practice)

## Conformance Covered
| Conformance |
| ----------- |
| WCAG 1.1.1  |
| WCAG 1.2.2  |
| WCAG 1.3.1  |
| WCAG 1.3.5  |
| WCAG 1.4.1  |
| WCAG 1.4.12 |
| WCAG 1.4.2  |
| WCAG 1.4.3  |
| WCAG 1.4.4  |
| WCAG 2.1.1  |
| WCAG 2.2.1  |
| WCAG 2.2.2  |
| WCAG 2.4.1  |
| WCAG 2.4.2  |
| WCAG 2.4.4  |
| WCAG 2.5.8  |
| WCAG 3.1.1  |
| WCAG 3.1.2  |
| WCAG 3.3.2  |
| WCAG 4.1.2  |

## WCAG 2.0 Level A
| Issue ID                    | Issue Description                                                                                                                                     | Severity    | Conformance            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------- |
| area-alt                    | Ensures `<area>` elements of image maps have alternate text                                                                                           | Must Fix    | WCAG 2.4.4, WCAG 4.1.2 |
| aria-allowed-attr           | Ensures an element's role supports its ARIA attributes                                                                                                | Must Fix    | WCAG 4.1.2             |
| aria-braille-equivalent          | Ensure aria-braillelabel and aria-brailleroledescription have a non-braille equivalent                                                                                                | Must Fix    | WCAG 4.1.2             |
| aria-command-name           | Ensures every ARIA button, link and menuitem has an accessible name                                                                                   | Must Fix    | WCAG 4.1.2             |
| aria-conditional-attr          | Ensures ARIA attributes are used as described in the specification of the element's role                                                  | Must Fix    | WCAG 4.1.2             |
| aria-deprecated-role          | Ensures elements do not use deprecated roles                                        | Good To Fix  | WCAG 4.1.2             |
| aria-hidden-body            | Ensures aria-hidden="true" is not present on the document body.                                                                                       | Must Fix    | WCAG 4.1.2             |
| aria-hidden-focus           | Ensures aria-hidden elements are not focusable nor contain focusable elements                                                                         | Must Fix    | WCAG 4.1.2             |
| aria-input-field-name       | Ensures every ARIA input field has an accessible name                                                                                                 | Must Fix    | WCAG 4.1.2             |
| aria-meter-name             | Ensures every ARIA meter node has an accessible name                                                                                                  | Must Fix    | WCAG 1.1.1             |
| aria-progressbar-name       | Ensures every ARIA progressbar node has an accessible name                                                                                            | Must Fix    | WCAG 1.1.1             |
| aria-prohibited-attr       | Ensures ARIA attributes are not prohibited for an element's rolessible name                                                                                            | Must Fix    | WCAG 4.1.2           |
| aria-required-attr          | Ensures elements with ARIA roles have all required ARIA attributes                                                                                    | Must Fix    | WCAG 4.1.2             |
| aria-required-children      | Ensures elements with an ARIA role that require child roles contain them                                                                              | Must Fix    | WCAG 1.3.1             |
| aria-required-parent        | Ensures elements with an ARIA role that require parent roles are contained by them                                                                    | Must Fix    | WCAG 1.3.1             |
| aria-roles                  | Ensures all elements with a role attribute use a valid value                                                                                          | Must Fix    | WCAG 4.1.2             |
| aria-toggle-field-name      | Ensures every ARIA toggle field has an accessible name                                                                                                | Must Fix    | WCAG 4.1.2             |
| aria-tooltip-name           | Ensures every ARIA tooltip node has an accessible name                                                                                                | Must Fix    | WCAG 4.1.2             |
| aria-valid-attr-value       | Ensures all ARIA attributes have valid values                                                                                                         | Must Fix    | WCAG 4.1.2             |
| aria-valid-attr             | Ensures attributes that begin with aria- are valid ARIA attributes                                                                                    | Must Fix    | WCAG 4.1.2             |
| blink                       | Ensures `<blink>` elements are not used                                                                                                               | Must Fix    | WCAG 2.2.2             |
| button-name                 | Ensures buttons have discernible text                                                                                                                 | Must Fix    | WCAG 4.1.2             |
| bypass                      | Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content                                         | Must Fix    | WCAG 2.4.1             |
| definition-list             | Ensures `<dl>` elements are structured correctly                                                                                                      | Must Fix    | WCAG 1.3.1             |
| dlitem                      | Ensures `<dt>` and `<dd>` elements are contained by a `<dl>`                                                                                          | Must Fix    | WCAG 1.3.1             |
| document-title              | Ensures each HTML document contains a non-empty `<title>` element                                                                                     | Must Fix    | WCAG 2.4.2             |
| duplicate-id-aria           | Ensures every id attribute value used in ARIA and in labels is unique                                                                                 | Must Fix    | WCAG 4.1.2             |
| form-field-multiple-labels  | Ensures form field does not have multiple label elements                                                                                              | Good to Fix | WCAG 3.3.2             |
| frame-focusable-content     | Ensures `<frame>` and `<iframe>` elements with focusable content do not have tabindex=-1                                                              | Must Fix    | WCAG 2.1.1             |
| frame-title-unique          | Ensures `<iframe>` and `<frame>` elements contain a unique title attribute                                                                            | Must Fix    | WCAG 4.1.2             |
| frame-title                 | Ensures `<iframe>` and `<frame>` elements have an accessible name                                                                                     | Must Fix    | WCAG 4.1.2             |
| html-has-lang               | Ensures every HTML document has a lang attribute                                                                                                      | Must Fix    | WCAG 3.1.1             |
| html-lang-valid             | Ensures the lang attribute of the `<html>` element has a valid value                                                                                  | Must Fix    | WCAG 3.1.1             |
| html-xml-lang-mismatch      | Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page                                         | Good to Fix | WCAG 3.1.1             |
| image-alt                   | Ensures `<img>` elements have alternate text or a role of none or presentation                                                                        | Must Fix    | WCAG 1.1.1             |
| input-button-name           | Ensures input buttons have discernible text                                                                                                           | Must Fix    | WCAG 4.1.2             |
| input-image-alt             | Ensures `<input type="image">` elements have alternate text                                                                                           | Must Fix    | WCAG 1.1.1, WCAG 4.1.2 |
| label                       | Ensures every form element has a label                                                                                                                | Must Fix    | WCAG 4.1.2             |
| link-in-text-block          | Ensure links are distinguished from surrounding text in a way that does not rely on color                                                             | Must Fix    | WCAG 1.4.1             |
| link-name                   | Ensures links have discernible text                                                                                                                   | Must Fix    | WCAG 2.4.4, WCAG 4.1.2 |
| list                        | Ensures that lists are structured correctly                                                                                                           | Must Fix    | WCAG 1.3.1             |
| listitem                    | Ensures `<li>` elements are used semantically                                                                                                         | Must Fix    | WCAG 1.3.1             |
| marquee                     | Ensures `<marquee>` elements are not used                                                                                                             | Must Fix    | WCAG 2.2.2             |
| meta-refresh                | Ensures `<meta http-equiv="refresh">` is not used for delayed refresh                                                                                 | Must Fix    | WCAG 2.2.1             |
| nested-interactive          | Ensures interactive controls are not nested as they are not always announced by screen readers or can cause focus problems for assistive technologies | Must Fix    | WCAG 4.1.2             |
| no-autoplay-audio           | Ensures `<video>` or `<audio>` elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio           | Good to Fix | WCAG 1.4.2             |
| object-alt                  | Ensures `<object>` elements have alternate text                                                                                                       | Must Fix    | WCAG 1.1.1             |
| role-img-alt                | Ensures [role="img"] elements have alternate text                                                                                                     | Must Fix    | WCAG 1.1.1             |
| scrollable-region-focusable | Ensure elements that have scrollable content are accessible by keyboard                                                                               | Must Fix    | WCAG 2.1.1             |
| select-name                 | Ensures select element has an accessible name                                                                                                         | Must Fix    | WCAG 4.1.2             |
| server-side-image-map       | Ensures that server-side image maps are not used                                                                                                      | Good to Fix | WCAG 2.1.1             |
| svg-img-alt                 | Ensures `<svg>` elements with an img, graphics-document or graphics-symbol role have an accessible text                                               | Must Fix    | WCAG 1.1.1             |
| td-headers-attr             | Ensure that each cell in a table that uses the headers attribute refers only to other cells in that table                                             | Must Fix    | WCAG 1.3.1             |
| th-has-data-cells           | Ensure that `<th>` elements and elements with role=columnheader/rowheader have data cells they describe                                               | Must Fix    | WCAG 1.3.1             |
| video-caption               | Ensures `<video>` elements have captions                                                                                                              | Must Fix    | WCAG 1.2.2             |

## WCAG 2.0 Level AA
| Issue ID       | Issue Description                                                                                               | Severity | Conformance |
| -------------- | --------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| color-contrast | Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds | Must Fix | WCAG 1.4.3  |
| meta-viewport  | Ensures `<meta name="viewport">` does not disable text scaling and zooming                                      | Must Fix | WCAG 1.4.4  |
| valid-lang     | Ensures lang attributes have valid values                                                                       | Must Fix | WCAG 3.1.2  |


## WCAG 2.2 Level AA
| Issue ID    | Issue Description                                                        | Severity | Conformance |
| ----------- | ------------------------------------------------------------------------ | -------- | ----------- |
| target-size | Ensure touch targets have sufficient size and space                      | Must Fix | WCAG 2.5.8  |

## Best Practice
| Issue ID                            | Issue Description                                                                                                                              | Severity    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| accesskeys                          | Ensures every accesskey attribute value is unique                                                                                              | Must Fix    |
| aria-allowed-role                   | Ensures role attribute has an appropriate value for the element                                                                                | Good to Fix |
| aria-dialog-name                    | Ensures every ARIA dialog and alertdialog node has an accessible name                                                                          | Must Fix    |
| aria-text                           | Ensures role="text" is used on elements with no focusable descendants                                                                          | Must Fix    |
| aria-treeitem-name                  | Ensures every ARIA treeitem node has an accessible name                                                                                        | Must Fix    |
| empty-heading                       | Ensures headings have discernible text                                                                                                         | Good to Fix |
| empty-table-header                  | Ensures table headers have discernible text                                                                                                    | Good to Fix |
| frame-tested                        | Ensures `<iframe>` and `<frame>` elements contain the axe-core script                                                                          | Must Fix    |
| heading-order                       | Ensures the order of headings is semantically correct                                                                                          | Good to Fix |
| image-redundant-alt                 | Ensure image alternative is not repeated as text                                                                                               | Good to Fix |
| label-title-only                    | Ensures that every form element has a visible label and is not solely labeled using hidden labels, or the title or aria-describedby attributes | Must Fix    |
| landmark-banner-is-top-level        | Ensures the banner landmark is at top level                                                                                                    | Good to Fix |
| landmark-complementary-is-top-level | Ensures the complementary landmark or aside is at top level                                                                                    | Good to Fix |
| landmark-contentinfo-is-top-level   | Ensures the contentinfo landmark is at top level                                                                                               | Good to Fix |
| landmark-main-is-top-level          | Ensures the main landmark is at top level                                                                                                      | Good to Fix |
| landmark-no-duplicate-banner        | Ensures the document has at most one banner landmark                                                                                           | Good to Fix |
| landmark-no-duplicate-contentinfo   | Ensures the document has at most one contentinfo landmark                                                                                      | Good to Fix |
| landmark-no-duplicate-main          | Ensures the document has at most one main landmark                                                                                             | Good to Fix |
| landmark-one-main                   | Ensures the document has a main landmark                                                                                                       | Good to Fix |
| landmark-unique                     | Landmarks should have a unique role or role/label/title (i.e. accessible name) combination                                                     | Good to Fix |
| meta-viewport-large                 | Ensures `<meta name="viewport">` can scale a significant amount                                                                                | Good to Fix |
| page-has-heading-one                | Ensure that the page, or at least one of its frames contains a level-one heading                                                               | Good to Fix |
| presentation-role-conflict          | Elements marked as presentational should not have global ARIA or tabindex to ensure all screen readers ignore them                             | Good to Fix |
| region                              | Ensures all page content is contained by landmarks                                                                                             | Good to Fix |
| scope-attr-valid                    | Ensures the scope attribute is used correctly on tables                                                                                        | Good to Fix |
| skip-link                           | Ensure all skip links have a focusable target                                                                                                  | Good to Fix |
| tabindex                            | Ensures tabindex attribute values are not greater than 0                                                                                       | Must Fix    |
| table-duplicate-name                | Ensure the `<caption>` element does not contain the same text as the summary attribute                                                         | Good to Fix |
