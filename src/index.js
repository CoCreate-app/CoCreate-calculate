import observer from '@cocreate/observer';
import CRUD from '@cocreate/crud-client';
import elements from '@cocreate/elements';

let crud
if(CRUD && CRUD.default)
	crud = CRUD.default
else
	crud = CRUD

var CoCreateCalculation = {

    init: function() {
        let calculationElements = document.querySelectorAll('[calculate]');
        this.initElements(calculationElements);
    },

    initElements: function(elements) {
        for(let el of elements)
            this.initElement(el);
    },

    initElement: function(ele) {
        const self = this;
        let calculation = ele.getAttribute('calculate');
        let selectors = this.getSelectors(calculation);

        for(let i = 0; i < selectors.length; i++) {
            let id = selectors[i];
            if (id.includes('{{')) return;
            
            // self.initEvents(ele, id);
            let inputs = document.querySelectorAll(id);
            for (let input of inputs){
                self.initEvent(ele, input);
            }
            
            observer.init({
                name: 'calculationSelectorInit',
                observe: ['addedNodes'],
                target: id,
                callback: function(mutation) {
                    self.initEvent(ele, mutation.target);
                    self.setCalcationResult(ele);
                }
            });
            
            self.setCalcationResult(ele);
        }
    },
    
    initEvent: function(ele, input) {
        const self = this;
        input.addEventListener('input', function() {
            self.setCalcationResult(ele);
        });

        // if(input.hasAttribute('calculate')) {
        //     input.addEventListener('changedCalcValue', function(e) {
        //         self.setCalcationResult(ele);
        //     });
        // }
    // self.setCalcationResult(ele);
    },
    
    getSelectors: function(string) {
        let tmp = string;

        let selectors = [];
        if(!tmp) return selectors;
        while(tmp.length > 0) {
            let firstIndex = tmp.indexOf('{');
            let secondIndex = tmp.indexOf('}', firstIndex);

            if(firstIndex > -1 && secondIndex > -1) {
                let id = tmp.substring(firstIndex + 1, secondIndex);

                if(selectors.indexOf(id) == -1) selectors.push(id);

                tmp = tmp.substring(secondIndex + 1);

            }
            else {
                return selectors;
            }
        }

        return selectors;
    },

    getValues: function(calculation) {
        let selectors = this.getSelectors(calculation);

        for(let i = 0; i < selectors.length; i++) {
            let selector = selectors[i];

            let value = null;
            let inputs = document.querySelectorAll(selector);
            
            for(let input of inputs){
                let val = null;
                if(input.getValue)
                    val = Number(input.getValue());
                else
                    val = elements.getValue();            
                val = Number(val);
                if(!Number.isNaN(value)) {
                    value += val;
                }
            }

            if(value != null && !Number.isNaN(value)) {
                calculation = calculation.replaceAll('{' + selector + '}', value);
            }
        }

        return calculation;
    },
    
    setCalcationResult: function(element) {
        const { document_id, isRealtime } = crud.getAttr(element);
        let calculation = element.getAttribute('calculate');

        let calString = this.getValues(calculation);

        if(calString) {
            let result = calculate(calString);
            
            // ToDO: input event below triggers save for all input elements but will not save for regular elements
            if (element.setValue) {
                element.setValue(result)
				if (document_id && isRealtime != "false") {
                    elements.save(element);
                } 
            }
            else {
                // if(element.value){
                    
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

    },
    
};

function calculate(string) {
    if(!string.match(/[a-z_]/i))
        return eval(string);
}

observer.init({
    name: 'CoCreateCalculationChangeValue',
    observe: ['attributes'],
    attributeName: ['calculate'],
    callback: function(mutation) {
        CoCreateCalculation.setCalcationResult(mutation.target);
    }
});

observer.init({
    name: 'CoCreateCalculationInit',
    observe: ['addedNodes'],
    target: '[calculate]',
    callback: function(mutation) {
        CoCreateCalculation.initElement(mutation.target);
    }
});

CoCreateCalculation.init();

export default CoCreateCalculation;
