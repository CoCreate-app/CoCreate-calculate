import observer from "@cocreate/observer"; // Module for observing DOM mutations.
import { queryElements, safeParse } from "@cocreate/utils"; // Utility for querying DOM elements and safe parsing.
import "@cocreate/element-prototype"; // Include custom element prototype extensions.

// Initializes the calculation elements within the document.
function init() {
    // Select all elements in the document with a "calculate" attribute.
    let calculateElements = document.querySelectorAll("[calculate]");
    // Initialize each of the selected elements.
    initElements(calculateElements);
}

// Initialize multiple elements by invoking initElement for each.
function initElements(elements) {
    // Iterate through the collection of elements and initialize each one.
    for (let el of elements) initElement(el);
}

// Asynchronously initializes an individual element with setup for calculations.
async function initElement(element) {
    // Fetch the calculate string from the element's attribute.
    let calculate = element.getAttribute("calculate");
    // Return early if the calculate string contains placeholders or template syntax.
    if (calculate.includes("{{") || calculate.includes("{[")) return;

    // Extract selectors from the calculate attribute value.
    let selectors = getSelectors(element.attributes["calculate"].value);

    // Iterate through each selector and set up elements impacted by them.
    for (let i = 0; i < selectors.length; i++) {
        // Find input elements based on the selector criteria.
        let inputs = queryElements({
            element,
            selector: selectors[i],
            type: "selector"
        });

        // Set up events for each found input element.
        for (let input of inputs) {
            initEvent(element, input);
        }

        // Initialize an observer to monitor newly added nodes that match the selector.
        observer.init({
            name: "calculateSelectorInit",
            types: ["addedNodes"],
            selector: selectors[i],
            // Callback function to run when nodes matching the selector are added.
            callback(mutation) {
                // Initialize events for the new element and update calculation.
                initEvent(element, mutation.target);
                setCalcationValue(element);
            }
        });
    }
    // Set initial calculation value when an element is being initialized.
    setCalcationValue(element);
}

/**
 * Extracts selector strings starting with '$' from within parentheses in a given string.
 * Ensures that the keyword (selector, closest, etc.) is followed by a word boundary.
 * Returns an array of unique matching selector strings.
 *
 * @param {string} string The input string to search.
 * @returns {string[]} An array of unique matching selector strings found.
 */
function getSelectors(string) {
    if (!string) {
        return []; // Return an empty array if input is null, undefined, or an empty string
    }

    // Regex provided by user: Finds parentheses, allows optional space,
    // captures from '$' + keyword + word boundary + rest until ')'
    const selectorRegex =
        /\(\s*(\$(?:selector|closest|parent|next|previous|document|frame|top)\b[^)]*)\)/g;

    const uniqueMatches = new Set();
    let match;

    // Use regex.exec() in a loop to find all matches
    while ((match = selectorRegex.exec(string)) !== null) {
        // match[1] contains the captured group (e.g., "$selector .button")
        // Add the trimmed match to the Set. Duplicates are automatically ignored.
        uniqueMatches.add(match[1].trim());

        // Handle potential edge case with zero-length matches to prevent infinite loops
        // Although less likely with this specific regex, it's good practice
        if (match.index === selectorRegex.lastIndex) {
            selectorRegex.lastIndex++;
        }
    }

    return Array.from(uniqueMatches);
}

// Map: Key = InputElement, Value = Array of Elements to update
const initializedInputs = new Map();

/**
 * Associates an element to be updated with a specific input element.
 * Attaches an 'input' event listener to the input element only once.
 * When the input event fires, calls setCalcationValue for all associated elements.
 *
 * @param {HTMLElement} element The element that needs to be updated.
 * @param {HTMLInputElement} input The input element that triggers the update.
 */
function initEvent(element, input) {
    const calculteElements = initializedInputs.get(input);
    if (calculteElements) {
        calculteElements.add(element);
        return;
    }

    initializedInputs.set(input, new Set([element]));

    input.addEventListener("input", function () {
        const elementsToUpdate = initializedInputs.get(input);

        if (elementsToUpdate) {
            for (const element of elementsToUpdate) {
                setCalcationValue(element);
            }
        }
    });
}

// Asynchronously set the calculated value for the given element.
async function setCalcationValue(element) {
    // Get the expression or formula from the element's "calculate" attribute.
    let calString = await getValues(element);
    // Evaluate the formula and set the calculated value back to the element.
    element.setValue(calculate(calString));
}

// Asynchronously retrieve values necessary for computing the calculation attribute of an element.
async function getValues(element) {
    // Get the expression that needs to be evaluated from the "calculate" attribute.
    let calculateAttr = element.getAttribute("calculate");

    // Parse the expression to extract any selectors which values need to contribute to calculation.
    let selectors = getSelectors(element.attributes["calculate"].value);

    // For each selector, retrieve and calculate the respective value.
    for (let i = 0; i < selectors.length; i++) {
        let value = 0; // Default value in case no input is found for the selector.

        // Query DOM elements based on selector.
        let inputs = queryElements({
            element,
            selector: selectors[i],
            type: "selector"
        });

        // Iterate through inputs/elements matched by the selector.
        for (let input of inputs) {
            // Initialize event listeners on inputs so that changes can update the calculation.
            initEvent(element, input);
            let val = null;

            // Attempt to get the value from the input element, if it can provide it.
            if (input.getValue) {
                val = Number(await input.getValue());
            }

            // Only accumulate valid numeric values.
            if (!Number.isNaN(val)) {
                value += val;
            } else {
                console.warn(
                    `Invalid value for selector "${selectors[i]}". Defaulting to 0.`
                );
            }
        }

        // Replace the placeholder in the calculation expression with the accumulated value.
        calculateAttr = calculateAttr.replaceAll(`(${selectors[i]})`, value);
    }
    return calculateAttr; // Return the resolved calculation expression.
}

/**
 * Main entry point for evaluating an expression string securely.
 * Passes the string off to the 0-dependency Recursive Descent Parser.
 *
 * @param {string | any} expression - The expression string to evaluate.
 * @param {object} context - Optional JSON context for dot notation variables.
 * @returns {any} The evaluated result, or null if an error occurs.
 */
function calculate(expression, context = {}) {
    // Offload parsing to the safe utility function
    return safeParse(expression, context);
}

observer.init([
    {
        name: "CoCreateCalculateChangeValue",
        types: ["attributes"],
        attributeFilter: ["calculate"],
        callback(mutation) {
            setCalcationValue(mutation.target);
        }
    },
    {
        name: "CoCreateCalculateInit",
        types: ["addedNodes"],
        selector: "[calculate]",
        callback(mutation) {
            initElement(mutation.target);
        }
    }
]);

init();

export default { initElements, initElement, calculate };