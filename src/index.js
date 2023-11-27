import observer from '@cocreate/observer';
import { getAttributes } from '@cocreate/utils';
// import { renderValue } from '@cocreate/render';
import '@cocreate/element-prototype';


function init() {
    let calculateElements = document.querySelectorAll('[calculate]');
    initElements(calculateElements);
}

function initElements(elements) {
    for (let el of elements)
        initElement(el);
}

function initElement(element) {
    let calculate = element.getAttribute('calculate');
    if (calculate.includes('{{') || calculate.includes('{['))
        return;

    let selectors = getSelectors(calculate);

    for (let i = 0; i < selectors.length; i++) {
        // if (selectors[i].includes('{{')) return;

        // initEvents(element, selectors[i]);
        let inputs = document.querySelectorAll(selectors[i]);
        for (let input of inputs) {
            initEvent(element, input);
        }

        observer.init({
            name: 'calculateSelectorInit',
            observe: ['addedNodes'],
            target: selectors[i],
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
        string = string.replace(match[0], '');
    }

    return selectors;
}

async function getValues(calculate) {
    let selectors = getSelectors(calculate);

    for (let i = 0; i < selectors.length; i++) {
        let selector = selectors[i];

        let value = null;
        let inputs = document.querySelectorAll(selector);

        for (let input of inputs) {
            let val = null;
            if (input.getValue)
                val = Number(await input.getValue());

            if (!Number.isNaN(value)) {
                value += val;
            }
        }

        if (value != null && !Number.isNaN(value)) {
            calculate = calculate.replaceAll('{' + selector + '}', value);
        }
    }

    return calculate;
}

function initEvent(element, input) {
    input.addEventListener('input', function () {
        setCalcationResult(element);
    });

    // if (input.hasAttribute('calculate')) {
    //     input.addEventListener('changedCalcValue', function(e) {
    //         setCalcationResult(element);
    //     });
    // }
    // setCalcationResult(element);
}

async function setCalcationResult(element) {
    const { object, isRealtime } = getAttributes(element);

    let calString = await getValues(element.getAttribute('calculate'));

    if (calString) {
        let result = calculate(calString);

        // TODO: input event below triggers save for all input elements but will not save for regular elements
        if (element.setValue) {
            element.setValue(result)
            if (object && isRealtime != "false") {
                element.save(element);
            }
        }
        else {
            // if (element.value){

            // }
            // else {
            element.innerHTML = result;
            // }
        }

        let inputEvent = new CustomEvent('input', { bubbles: true });
        Object.defineProperty(inputEvent, 'target', { writable: false, value: element });
        element.dispatchEvent(inputEvent);

        //. set custom event
        // var event = new CustomEvent('changedCalcValue', {
        //     bubbles: true,
        // });
        // element.dispatchEvent(event);
    }

}

function calculate(string) {
    if (/^[0-9+\-*/()%||?\s:=.]*$/.test(string))
        return eval(string);
}

observer.init({
    name: 'CoCreateCalculateChangeValue',
    observe: ['attributes'],
    attributeName: ['calculate'],
    callback(mutation) {
        setCalcationResult(mutation.target);
    }
});

observer.init({
    name: 'CoCreateCalculateInit',
    observe: ['addedNodes'],
    target: '[calculate]',
    callback(mutation) {
        initElement(mutation.target);
    }
});

init();

export default { initElements, initElement, calculate };
