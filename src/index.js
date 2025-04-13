import observer from "@cocreate/observer"; // Module for observing DOM mutations.
import { queryElements } from "@cocreate/utils"; // Utility for querying DOM elements.
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
	let calculate = element.getAttribute("calculate");

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
		calculate = calculate.replaceAll(`(${selectors[i]})`, value);
	}
	return calculate; // Return the resolved calculation expression.
}

// Defines mathematical constants available in expressions.
const constants = { PI: Math.PI, E: Math.E };

// Defines allowed mathematical functions and maps them to their respective JavaScript Math counterparts.
const functions = {
	abs: Math.abs, // Absolute value
	ceil: Math.ceil, // Ceiling function
	floor: Math.floor, // Floor function
	round: Math.round, // Round to nearest integer
	max: Math.max, // Maximum value (assumes arity 2 in RPN)
	min: Math.min, // Minimum value (assumes arity 2 in RPN)
	pow: Math.pow, // Exponentiation
	sqrt: Math.sqrt, // Square root
	log: Math.log, // Natural logarithm
	sin: Math.sin, // Sine function
	cos: Math.cos, // Cosine function
	tan: Math.tan // Tangent function
};

/**
 * Tokenizer for Core Mathematical Expressions.
 * Converts a mathematical expression string (without ternary operators) into an array of tokens.
 * Each token is an object with 'type' and 'value'.
 * Supported types: 'literal', 'identifier', 'operator', 'function', 'open_paren', 'close_paren', 'comma', 'unknown'.
 *
 * @param {string} expression - The mathematical expression string to tokenize.
 * @returns {Array<object>} An array of token objects.
 */
function tokenizeCore(expression) {
	const tokens = [];
	// Regular expression to capture recognized patterns:
	// 1: Numbers (integer or decimal)
	// 2: Identifiers (variable names, function names, constants like PI) - starting with letter or _, followed by letters, numbers, or _
	// 3: Multi-character comparison operators (>=, <=, ==, !=)
	// 4: Single-character operators, parentheses, comma, or whitespace that might be part of an operator later (like '<' in '<=')
	// 5: Whitespace sequences
	const regex =
		/(\d+(?:\.\d+)?)|([a-zA-Z_][a-zA-Z0-9_]*)|(>=|<=|==|!=)|([\+\-\*\/%^ \(\),<>])|(\s+)/g;
	let match;
	let lastToken = null; // Keep track of the previous token to help identify unary minus
	let expectedIndex = 0; // Track the expected start index of the next token

	// Iterate through all matches found by the regex in the expression string
	while ((match = regex.exec(expression)) !== null) {
		/* ... */ // Assume original complex logic might be here, focusing on the provided snippet

		// Check for unrecognized character sequences between valid tokens
		if (match.index !== expectedIndex) {
			const gap = expression.substring(expectedIndex, match.index);
			// Ignore gaps that are only whitespace
			if (gap.trim() !== "") {
				// Issue a warning for unrecognized characters, but attempt to continue tokenizing
				console.warn(
					`Invalid character sequence found near index ${expectedIndex}: '${gap}'`
				);
				// Note: Consider adding an 'error' or 'unknown_sequence' token type if needed for stricter parsing downstream
			}
		}

		let tokenStr = match[0]; // The matched string
		let token; // The token object to be created

		// Group 5: Whitespace
		if (match[5]) {
			// Ignore whitespace; simply advance the expected index
			expectedIndex = regex.lastIndex;
			continue; // Move to the next match
		}

		// Group 1: Literal (Number)
		if (match[1]) {
			token = { type: "literal", value: parseFloat(tokenStr) };
		}
		// Group 2: Identifier (Constant or Function Name)
		else if (match[2]) {
			if (tokenStr in constants) {
				// If it's a known constant, treat it as a literal value
				token = { type: "literal", value: constants[tokenStr] };
			} else if (tokenStr in functions) {
				// If it's a known function name
				token = { type: "function", value: tokenStr };
			} else {
				// If it's not a known constant or function
				console.warn(`Unknown identifier: ${tokenStr}`);
				// Create an 'unknown' token type. This allows the process to continue,
				// but downstream functions (like Shunting-Yard or evaluator) should handle or ignore it.
				token = { type: "unknown", value: tokenStr };
			}
		}
		// Group 3: Comparison Operators (>=, <=, ==, !=)
		else if (match[3]) {
			token = {
				type: "operator",
				value: tokenStr,
				precedence: 1, // Lower precedence than arithmetic operators
				associativity: "left"
			};
		}
		// Group 4: Other Operators/Punctuation (+, -, *, /, %, ^, (, ), ,, <, >)
		else if (match[4]) {
			tokenStr = tokenStr.trim(); // Remove surrounding whitespace if captured by the regex group
			// This check should ideally not be needed if regex correctly excludes pure whitespace via group 5, but acts as a safeguard.
			if (!tokenStr) {
				expectedIndex = regex.lastIndex;
				continue;
			}

			// Distinguish between unary minus and binary subtraction
			if (tokenStr === "-") {
				const isUnary =
					lastToken === null || // Beginning of expression
					["operator", "open_paren", "comma"].includes(
						lastToken?.type
					); // Following an operator, open parenthesis, or comma

				token = isUnary
					? {
							// Unary minus
							type: "operator",
							value: "unary-", // Special value to distinguish from binary minus
							precedence: 4, // Higher precedence than multiplication/division
							associativity: "right"
					  }
					: {
							// Binary minus (subtraction)
							type: "operator",
							value: "-",
							precedence: 2, // Same precedence as addition
							associativity: "left"
					  };
			} else if (tokenStr === "+") {
				// Note: Unary plus is often ignored or handled implicitly, but could be tokenized similarly if needed.
				token = {
					type: "operator",
					value: "+",
					precedence: 2,
					associativity: "left"
				};
			} else if (tokenStr === "*" || tokenStr === "/") {
				token = {
					type: "operator",
					value: tokenStr,
					precedence: 3,
					associativity: "left"
				};
			} else if (tokenStr === "%") {
				// Modulo operator
				token = {
					type: "operator",
					value: tokenStr,
					precedence: 3,
					associativity: "left"
				};
			} else if (tokenStr === "^") {
				// Exponentiation operator
				token = {
					type: "operator",
					value: "^",
					precedence: 5,
					associativity: "right"
				}; // Highest precedence, right-associative
			} else if (tokenStr === ">" || tokenStr === "<") {
				// Simple comparison operators
				token = {
					type: "operator",
					value: tokenStr,
					precedence: 1,
					associativity: "left"
				}; // Same low precedence as other comparisons
			} else if (tokenStr === "(") {
				token = { type: "open_paren", value: "(" };
			} else if (tokenStr === ")") {
				token = { type: "close_paren", value: ")" };
			} else if (tokenStr === ",") {
				// Comma, typically used as function argument separator
				token = { type: "comma", value: "," };
			} else {
				// If the character is captured by group 4 but isn't handled above
				console.warn(
					`Unhandled punctuation/operator token: '${tokenStr}'`
				);
				// Mark as unknown
				token = { type: "unknown", value: tokenStr };
			}
		} else {
			// This block should theoretically not be reached if the regex covers all cases correctly.
			// It acts as a fallback error indicator.
			console.warn(
				`Tokenizer internal regex error: No group matched near '${expression.substring(
					expectedIndex
				)}'`
			);
			// Optionally create an 'error' token or skip
		}

		// If a valid (or unknown) token was created, add it to the list
		if (token) {
			tokens.push(token);
			lastToken = token; // Update lastToken for the next iteration's unary minus check
		}

		// Advance the expected starting position for the next token search
		expectedIndex = regex.lastIndex;
	}

	// After the loop, check if the entire string was consumed by the tokenizer
	if (expectedIndex < expression.length) {
		const trailing = expression.substring(expectedIndex).trim();
		// If there are non-whitespace characters remaining, they were not tokenized
		if (trailing) {
			console.warn(`Invalid trailing characters ignored: '${trailing}'`);
		}
	}

	return tokens;
}

/**
 * Converts an infix token stream (from tokenizeCore) to a Reverse Polish Notation (RPN) queue.
 * Implements the Shunting-yard algorithm. Does not handle ternary operators directly.
 * Handles operator precedence and associativity, functions, and parentheses.
 *
 * @param {Array<object>} tokens - The array of token objects from tokenizeCore.
 * @returns {Array<object>} An array of token objects arranged in RPN order.
 */
function shuntingYardCore(tokens) {
	const outputQueue = []; // Stores the RPN output
	const operatorStack = []; // Temporary stack for operators, functions, and parentheses

	// Helper function to view the top element of a stack without removing it
	const peek = (stack) => (stack.length > 0 ? stack[stack.length - 1] : null);

	// Process each token from the input array
	for (const token of tokens) {
		// If the token is invalid or marked as unknown by the tokenizer, skip it.
		if (!token || token.type === "unknown") {
			console.warn(
				`Shunting-Yard skipping unknown token: ${token?.value}`
			);
			continue;
		}

		/* ... */ // Assume original SY logic structure might be here

		// Handle token based on its type
		switch (token.type) {
			case "literal":
				// Literals (numbers) are immediately added to the output queue.
				outputQueue.push(token);
				break;

			case "function":
				// Functions are pushed onto the operator stack.
				operatorStack.push(token);
				break;

			case "comma":
				// Commas indicate separation of arguments in a function call.
				// Pop operators from the stack to the output until an opening parenthesis is found.
				while (peek(operatorStack)?.type !== "open_paren") {
					const topOp = peek(operatorStack);
					// If the stack becomes empty before finding '(', it implies mismatched parentheses or comma.
					if (topOp === null) {
						console.warn(
							"Mismatched comma or parentheses detected during comma handling."
						);
						// Break to prevent infinite loop in error case. Consider throwing an error for stricter handling.
						break;
					}
					outputQueue.push(operatorStack.pop());
				}
				// The '(' remains on the stack to mark the start of the arguments.
				break;

			case "operator":
				// Handle operators based on precedence and associativity.
				const currentOp = token;
				let topOp = peek(operatorStack);
				// While there's an operator on the stack with higher or equal precedence (considering associativity)...
				while (
					topOp?.type === "operator" &&
					((currentOp.associativity === "left" &&
						currentOp.precedence <= topOp.precedence) ||
						(currentOp.associativity === "right" &&
							currentOp.precedence < topOp.precedence))
				) {
					// Pop the operator from the stack to the output queue.
					outputQueue.push(operatorStack.pop());
					topOp = peek(operatorStack); // Check the new top operator
				}
				// Push the current operator onto the stack.
				operatorStack.push(currentOp);
				break;

			case "open_paren":
				// Opening parentheses are always pushed onto the operator stack.
				operatorStack.push(token);
				break;

			case "close_paren":
				// Closing parenthesis: process operators until the matching opening parenthesis.
				let foundOpenParen = false;
				while (peek(operatorStack)?.type !== "open_paren") {
					const opToPop = operatorStack.pop();
					// If the stack runs out before finding '(', parentheses are mismatched.
					if (!opToPop) {
						console.warn(
							"Mismatched parentheses: Closing parenthesis found without matching open parenthesis."
						);
						// Break to prevent potential infinite loop if stack is empty.
						break;
					}
					outputQueue.push(opToPop);
				}

				// If an opening parenthesis was found, pop it from the stack (it's not added to output).
				if (peek(operatorStack)?.type === "open_paren") {
					operatorStack.pop();
					foundOpenParen = true;
				} // Mismatch case already warned inside the loop

				// If the token preceding the parenthesis pair was a function name, pop it to the output.
				// This places the function after its arguments in RPN.
				if (peek(operatorStack)?.type === "function") {
					outputQueue.push(operatorStack.pop());
				}
				break;

			default:
				// Should not happen if tokenizer provides known types, but acts as a safeguard.
				console.warn(
					`Unknown token type encountered in Shunting-Yard: ${token.type}`
				);
		}
	}

	// After processing all tokens, pop any remaining operators/functions from the stack to the output queue.
	while (peek(operatorStack) !== null) {
		const op = operatorStack.pop();
		// If an opening parenthesis is found here, it means parentheses were mismatched.
		if (op.type === "open_paren") {
			console.warn(
				"Mismatched parentheses: Open parenthesis remaining on stack at the end."
			);
			// Continue processing other operators, but the RPN is likely invalid.
		} else {
			outputQueue.push(op);
		}
	}

	return outputQueue; // Return the final RPN token queue.
}

/**
 * Evaluates a Reverse Polish Notation (RPN) token queue generated by shuntingYardCore.
 * Performs the actual calculations based on operators and function calls.
 * Handles basic error conditions like stack underflow, division by zero, and unknown tokens.
 * Returns the numerical result or null if evaluation fails.
 *
 * @param {Array<object>} rpnQueue - The array of token objects in RPN order.
 * @returns {number | null} The calculated numerical result, or null if an error occurs.
 */
function evaluateRPNCore(rpnQueue) {
	if (!rpnQueue || rpnQueue.length === 0) {
		return null;
	}

	const evaluationStack = []; // Stack used to hold operands during RPN evaluation.

	for (const token of rpnQueue) {
		if (token.type === "literal") {
			evaluationStack.push(token.value);
		} else if (token.type === "operator") {
			if (token.value === "unary-") {
				if (evaluationStack.length < 1) {
					console.warn(
						`Stack underflow error during unary '-' operation.`
					);
					return null;
				}
				// Pop the operand, negate it, and push the result back.
				evaluationStack.push(-evaluationStack.pop());
			}
			// Handle binary operators
			else {
				// Requires two operands on the stack.
				if (evaluationStack.length < 2) {
					console.warn(
						`Stack underflow error during binary '${token.value}' operation.`
					);
					return null;
				}
				// Pop the top two operands. Note: the second operand (b) is popped first.
				const b = evaluationStack.pop();
				const a = evaluationStack.pop();
				let result;

				// Perform the operation based on the operator value.
				switch (token.value) {
					case "+":
						result = a + b;
						break;
					case "-":
						result = a - b;
						break;
					case "*":
						result = a * b;
						break;
					case "/":
						// Check for division by zero.
						if (b === 0) {
							console.warn("Division by zero encountered.");
							return null;
						}
						result = a / b;
						break;
					case "%":
						// Check for modulo by zero (JavaScript's % operator returns NaN in this case).
						if (b === 0) {
							console.warn("Modulo by zero encountered.");
							return null; // Return null for consistency with division by zero.
						}
						result = a % b;
						break;
					case "^":
						result = Math.pow(a, b);
						break;
					// Comparison operators return 1 for true, 0 for false, consistent with C-like behavior.
					case ">":
						result = a > b ? 1 : 0;
						break;
					case "<":
						result = a < b ? 1 : 0;
						break;
					case ">=":
						result = a >= b ? 1 : 0;
						break;
					case "<=":
						result = a <= b ? 1 : 0;
						break;
					case "==":
						result = a === b ? 1 : 0;
						break; // Use strict equality
					case "!=":
						result = a !== b ? 1 : 0;
						break; // Use strict inequality
					default:
						console.warn(
							`Unknown operator encountered during evaluation: ${token.value}`
						);
						return null;
				}
				evaluationStack.push(result);
			}
		}
		// If the token is a function call...
		else if (token.type === "function") {
			// Look up the function implementation (assuming 'functions' is a globally accessible object/map).
			const func = functions[token.value];
			if (!func) {
				// If the function name is not found in the available functions.
				console.warn(
					`Unknown function encountered during evaluation: ${token.value}`
				);
				return null;
			}

			// Determine the expected number of arguments (arity) for the function.
			// Note: Relying solely on func.length can be unreliable for functions with default parameters or rest parameters.
			// This example uses a mix of func.length and hardcoded arity for common Math functions.
			// A more robust implementation might store arity explicitly alongside the function definition.
			let arity = func.length; // Default assumption based on function definition
			// Explicitly define arity for functions where .length might be ambiguous or for built-ins.
			// (Example adjustments - tailor these to the actual functions defined)
			if (["max", "min", "pow"].includes(token.value)) arity = 2;
			if (
				[
					"sqrt",
					"abs",
					"ceil",
					"floor",
					"round",
					"log",
					"sin",
					"cos",
					"tan"
				].includes(token.value)
			)
				arity = 1;
			// Add more overrides as needed for your specific function set.

			// Check if there are enough operands on the stack for the function's arity.
			if (evaluationStack.length < arity) {
				console.warn(
					`Stack underflow for function '${token.value}'. Need ${arity} args, found ${evaluationStack.length}.`
				);
				return null;
			}

			// Pop the required number of arguments from the stack.
			const args = [];
			for (let i = 0; i < arity; i++) {
				args.push(evaluationStack.pop());
			}

			try {
				// Call the function with the arguments. Since they were popped in reverse,
				const functionResult = func(...args.reverse());
				evaluationStack.push(functionResult);
			} catch (funcError) {
				// Catch errors that might occur during the function's execution (e.g., Math.log(-1) -> NaN, invalid inputs).
				console.warn(
					`Error executing function '${token.value}': ${funcError.message}`
				);
				return null;
			}
		} else {
			// If a token type other than literal, operator, or function appears in the RPN queue.
			// This might indicate an error in the RPN generation (Shunting-Yard).
			console.warn(
				`Unknown RPN token type encountered: ${token?.type} (Value: ${token?.value})`
			);
			return null;
		}
	}

	// After processing all tokens, the evaluation stack should contain exactly one value: the final result.
	if (evaluationStack.length !== 1) {
		// If the stack size is not 1, it usually indicates an invalid expression or a bug in the RPN conversion/evaluation.
		console.warn(
			`Evaluation finished with invalid stack size: ${
				evaluationStack.length
			}. Contents: ${JSON.stringify(evaluationStack)}`
		);
		return null;
	}

	const finalResult = evaluationStack[0];

	// Validate the final result to ensure it's a usable number.
	// Allow 0 and 1 specifically, as they are valid results from boolean comparisons.
	if (finalResult === 0 || finalResult === 1) {
		return finalResult;
	}
	// Check if the result is a finite number (not NaN, Infinity, or -Infinity).
	if (typeof finalResult !== "number" || !Number.isFinite(finalResult)) {
		console.warn(
			`Final evaluation result is not a valid finite number: ${finalResult}`
		);
		return null;
	}

	return finalResult;
}

/**
 * Parses a string expression to find the components of a *top-level* ternary expression.
 * Looks for the first '?' and its corresponding ':' at the same parenthesis nesting level.
 * Returns an object with { condition, trueExpr, falseExpr } if found, otherwise null.
 * Respects parentheses to avoid splitting nested ternaries incorrectly.
 *
 * @param {string} expression - The expression string to parse.
 * @returns {{condition: string, trueExpr: string, falseExpr: string} | null} Object with parts or null.
 */
function parseTernary(expression) {
	let parenLevel = 0; // Tracks nesting level of parentheses
	let qIndex = -1; // Index of the top-level '?'

	// First pass: Find the first '?' at parenthesis level 0.
	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];
		if (char === "(") {
			parenLevel++;
		} else if (char === ")") {
			parenLevel--;
		} else if (char === "?" && parenLevel === 0) {
			// Found the '?' at the top level
			qIndex = i;
			break; // Stop searching once the first top-level '?' is found
		}

		// Error check: If parenLevel goes below 0, parentheses are mismatched.
		if (parenLevel < 0) {
			console.warn(
				`Mismatched parentheses detected (too many ')') in ternary structure near index ${i}.`
			);
			return null; // Indicate parsing failure due to invalid structure
		}
	}

	// If no top-level '?' was found, it's not a simple ternary structure at this level.
	if (qIndex === -1) {
		return null;
	}

	// Second pass: Find the corresponding ':' at level 0, starting *after* the '?'.
	parenLevel = 0; // Reset parenthesis level counter for the colon search
	let cIndex = -1; // Index of the top-level ':'
	for (let i = qIndex + 1; i < expression.length; i++) {
		const char = expression[i];
		if (char === "(") {
			parenLevel++;
		} else if (char === ")") {
			parenLevel--;
		} else if (char === ":" && parenLevel === 0) {
			// Found the matching ':' at the top level
			cIndex = i;
			break; // Stop searching
		}
		// Error check during colon search
		if (parenLevel < 0) {
			console.warn(
				`Mismatched parentheses detected (too many ')') after '?' in ternary structure near index ${i}.`
			);
			return null; // Indicate parsing failure
		}
	}

	// If no matching top-level ':' was found after the '?', the structure is invalid.
	if (cIndex === -1) {
		console.warn(
			`Invalid ternary structure: No matching top-level ':' found for '?' at index ${qIndex}.`
		);
		return null;
	}

	// Extract the three parts of the ternary expression.
	const condition = expression.substring(0, qIndex).trim();
	const trueExpr = expression.substring(qIndex + 1, cIndex).trim();
	const falseExpr = expression.substring(cIndex + 1).trim();

	// Validate that none of the parts are empty after trimming.
	if (!condition || !trueExpr || !falseExpr) {
		console.warn(
			`Invalid ternary structure: empty part detected in "${expression}". Condition: "${condition}", True: "${trueExpr}", False: "${falseExpr}".`
		);
		return null;
	}

	return { condition, trueExpr, falseExpr };
}

/**
 * Main entry point for evaluating a mathematical expression string.
 * Handles nested ternary operators (`? :`) recursively with short-circuiting.
 * For non-ternary expressions or sub-expressions, it uses the core engine:
 * Tokenizer -> Shunting-Yard -> RPN Evaluator.
 * Provides graceful handling of common errors, returning null on failure.
 *
 * @param {string | any} expression - The expression string to evaluate. Non-string inputs are converted.
 * @returns {number | null} The final calculated result, or null if evaluation fails or the expression is invalid.
 */
function calculate(expression) {
	// Store the original input, converting to string if necessary, for logging context.
	const originalExpr =
		typeof expression === "string" ? expression : String(expression);

	try {
		// Ensure we are working with a trimmed string.
		let currentExpr =
			typeof expression === "string" ? expression.trim() : "";

		// Handle empty or whitespace-only expressions immediately.
		if (!currentExpr) {
			// Warning is optional here, depends if empty input is expected or an error.
			// console.warn("Expression is empty or evaluates to empty string.");
			return null; // Return null for empty expression.
		}

		/* --- Optional Step: Remove Fully Wrapping Parentheses ---
		 * This simplifies parsing by removing redundant outer parentheses, e.g., "((1 + 2))" becomes "1 + 2".
		 * It iteratively unwraps as long as the outermost characters are '(' and ')'
		 * and they correctly balance across the entire contained expression.
		 */
		let unwrapped = false; // Flag to track if any unwrapping occurred (mainly for debugging)
		while (currentExpr.startsWith("(") && currentExpr.endsWith(")")) {
			let balance = 0;
			let canUnwrap = true; // Assume it can be unwrapped unless proven otherwise

			// Handle edge case like "()" which cannot be unwrapped to an empty string meaningfully here.
			if (currentExpr.length <= 2) {
				canUnwrap = false;
				break;
			}

			// Check if the parentheses truly wrap the *entire* internal expression.
			for (let i = 0; i < currentExpr.length; i++) {
				if (currentExpr[i] === "(") balance++;
				else if (currentExpr[i] === ")") balance--;

				// If balance returns to 0 *before* the very last character,
				// it means the parentheses don't wrap the whole thing, e.g., "(1) + (2)".
				if (balance === 0 && i < currentExpr.length - 1) {
					canUnwrap = false;
					break;
				}
				// If balance goes negative at any point, parentheses are mismatched.
				if (balance < 0) {
					canUnwrap = false; // Should ideally be caught later, but good safeguard.
					break;
				}
			}

			// The final balance must also be 0 for the wrapping to be valid.
			if (balance !== 0) {
				canUnwrap = false;
			}

			// If the checks pass, perform the unwrap.
			if (canUnwrap) {
				currentExpr = currentExpr
					.substring(1, currentExpr.length - 1)
					.trim();
				unwrapped = true;
			} else {
				// If cannot unwrap this layer, stop the unwrapping process.
				break;
			}
		}
		/* --- End Parenthesis Unwrapping --- */

		// 1. Attempt to parse the current (potentially unwrapped) expression as a top-level ternary.
		const ternaryParts = parseTernary(currentExpr);

		// 2. If it successfully parsed as a ternary structure...
		if (ternaryParts) {
			// 2a. Recursively evaluate the condition part first.
			const condResult = calculate(ternaryParts.condition);

			// Handle cases where the condition itself fails to evaluate.
			if (condResult === null) {
				// Log a warning indicating the condition evaluation failed.
				console.warn(
					`Failed to evaluate ternary condition: "${ternaryParts.condition}" in context: "${originalExpr}". Defaulting to false branch.`
				);
				// Proceed as if the condition is false for robustness, evaluating the 'falseExpr'.
				// Alternatively, could return null here to propagate the failure.
				return calculate(ternaryParts.falseExpr);
			}

			// 2b. Short-circuiting: Evaluate *only* the required branch based on the condition result.
			// The core evaluator returns 1 for true comparisons, 0 for false.
			// Any non-zero number is treated as "truthy" here.
			if (condResult) {
				// Checks for truthiness (non-zero result)
				return calculate(ternaryParts.trueExpr); // Evaluate the true branch recursively.
			} else {
				return calculate(ternaryParts.falseExpr); // Evaluate the false branch recursively.
			}
		}
		// 3. If it's not a top-level ternary (or parseTernary returned null due to errors)...
		else {
			// Evaluate the expression using the standard core math engine pipeline.
			const tokens = tokenizeCore(currentExpr);
			const rpnQueue = shuntingYardCore(tokens);
			// evaluateRPNCore handles internal errors (like division by zero, unknown tokens) and returns null on failure.
			const result = evaluateRPNCore(rpnQueue);
			return result; // Return the result (which could be a number or null).
		}
	} catch (error) {
		// Catch any unexpected runtime errors during the calculation process.
		const contextExpr =
			originalExpr.length > 50
				? originalExpr.substring(0, 47) + "..." // Truncate long expressions for logging
				: originalExpr;
		console.warn(
			`Unexpected calculation error: ${error.message} (Expression context: "${contextExpr}")`,
			error
		);
		return null;
	}
}

observer.init({
	name: "CoCreateCalculateChangeValue",
	types: ["attributes"],
	attributeFilter: ["calculate"],
	callback(mutation) {
		setCalcationValue(mutation.target);
	}
});

observer.init({
	name: "CoCreateCalculateInit",
	types: ["addedNodes"],
	selector: "[calculate]",
	callback(mutation) {
		initElement(mutation.target);
	}
});

init();

export default { initElements, initElement, calculate };
