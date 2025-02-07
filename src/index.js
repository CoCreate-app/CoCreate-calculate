import observer from "@cocreate/observer";
import { getAttributes } from "@cocreate/utils";
// import { renderValue } from '@cocreate/render';
import "@cocreate/element-prototype";

function init() {
	let calculateElements = document.querySelectorAll("[calculate]");
	initElements(calculateElements);
}

function initElements(elements) {
	for (let el of elements) initElement(el);
}

function initElement(element) {
	let calculate = element.getAttribute("calculate");
	if (calculate.includes("{{") || calculate.includes("{[")) return;

	let selectors = getSelectors(calculate);

	for (let i = 0; i < selectors.length; i++) {
		// if (selectors[i].includes('{{')) return;

		// initEvents(element, selectors[i]);
		let inputs = document.querySelectorAll(selectors[i]);
		for (let input of inputs) {
			initEvent(element, input);
		}

		observer.init({
			name: "calculateSelectorInit",
			observe: ["addedNodes"],
			selector: selectors[i],
			callback(mutation) {
				initEvent(element, mutation.target);
				setCalcationResult(element);
			}
		});
	}
	setCalcationResult(element);
}

function getSelectors(string) {
	let regex = /\{\((?:(?!\{\().)*?\)\}/;
	let selectors = [];

	let match;
	while ((match = regex.exec(string)) !== null) {
		// Extract the content inside the braces (excluding the leading '{(' and trailing ')}')
		let selector = match[0].slice(2, -2);

		if (selectors.indexOf(selector) === -1) {
			selectors.push(selector);
		}

		// Replace the found match with an empty string to avoid reprocessing in the next iteration
		string = string.replace(match[0], "");
	}

	return selectors;
}

async function getValues(calculate) {
	let selectors = getSelectors(calculate);

	for (let selector of selectors) {
		let value = 0; // Default to 0 for missing inputs
		let inputs = document.querySelectorAll(selector);

		for (let input of inputs) {
			let val = null;
			if (input.getValue) {
				val = Number(await input.getValue());
			}

			if (!Number.isNaN(val)) {
				value += val; // Accumulate valid numeric values
			} else {
				console.warn(
					`Invalid value for selector "${selector}". Defaulting to 0.`
				);
			}
		}

		calculate = calculate.replaceAll(`{(${selector})}`, value);
	}

	return calculate;
}
function initEvent(element, input) {
	if (input._calculateInitialized) return; // Avoid duplicate listeners
	input._calculateInitialized = true;

	input.addEventListener("input", function () {
		setCalcationResult(element);
	});
}

async function setCalcationResult(element) {
	const { object, isRealtime } = getAttributes(element);

	let calString = await getValues(element.getAttribute("calculate"));

	if (calString) {
		let result = calculate(calString);

		if (element.setValue) {
			element.setValue(result);
			if (object && isRealtime && isRealtime !== "false") {
				element.save(element);
			}
		} else {
			element.innerHTML = result;
		}

		let inputEvent = new CustomEvent("input", { bubbles: true });
		Object.defineProperty(inputEvent, "target", {
			writable: false,
			value: element
		});
		element.dispatchEvent(inputEvent);
	}
}

function calculate(expression) {
	try {
		// Sanitize the expression to allow only valid characters
		const sanitizedExpression = expression.replace(
			/[^a-zA-Z0-9+\-*/()%.\s]/g,
			""
		);

		// Extract identifiers (e.g., Math.round, Date.now) using regex
		const identifierRegex =
			/\b[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)?\b/g;
		const matches = sanitizedExpression.match(identifierRegex) || [];

		// Validate each identifier
		for (const match of matches) {
			const [object, method] = match.split(".");

			// Validate allowed objects and methods
			if (
				(object === "Math" && (!method || method in Math)) ||
				(object === "Number" && (!method || method in Number))
			) {
				// Valid identifier
				continue;
			}

			throw new Error(`Invalid identifier: ${match}`);
		}

		// Safely evaluate the sanitized expression
		return new Function(`return (${sanitizedExpression})`)();
	} catch (error) {
		console.error("Error evaluating expression:", error.message);
		return null;
	}
}

observer.init({
	name: "CoCreateCalculateChangeValue",
	observe: ["attributes"],
	attributeName: ["calculate"],
	callback(mutation) {
		setCalcationResult(mutation.target);
	}
});

observer.init({
	name: "CoCreateCalculateInit",
	observe: ["addedNodes"],
	selector: "[calculate]",
	callback(mutation) {
		initElement(mutation.target);
	}
});

init();

export default { initElements, initElement, calculate };
