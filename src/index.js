import CoCreateObserver from '@cocreate/observer';
import crud from '@cocreate/crud-client';
import elements from '@cocreate/elements';

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
        let data_calculation = ele.getAttribute('calculate');
        let ids = this.getIds(data_calculation);

        let selectors = [];
        for(let i = 0; i < ids.length; i++) {
            let id = ids[i];

            let input = null;
            try {
                input = document.querySelector(id);
            }
            catch(error) { input = null; }

            if(input) {
                input.addEventListener('input', function() {
                    self.setCalcationResult(ele);
                });

                if(input.hasAttribute('calculate')) {
                    input.addEventListener('changedCalcValue', function(e) {
                        self.setCalcationResult(ele);
                    });
                }

            }
            else {
                //. add event of special operator

                let selector = this.__getOperatorSelector(id);
                if(selector) {
                    selectors.push(selector);
                }
            }
            self.setCalcationResult(ele);
        }

        if(selectors.length === 0) {
            self.setCalcationResult(ele);
        }
        if(selectors.length > 0) {
            document.addEventListener('changedCalcValue', function(e) {

                let isMatched = false;
                selectors.forEach(selector => {
                    if(e.target.matches(selector)) {
                        isMatched = true;
                        return;
                    }
                });

                if(isMatched) {
                    self.setCalcationResult(ele);
                }
            });
        }
    },

    __getOperatorSelector(value) {
        let result = /SUM\(\s*([\w\W]+)\s*\)/g.exec(value);
        if(result && result[1]) {
            return result[1].trim();
        }
        return null;
    },

    calculationSpecialOperator(value) {
        let self = this;
        let sum = null;
        let result = /SUM\(\s*([\w\W]+)\s*\)/g.exec(value);
        if(result) {
            let selector = result[1].trim();

            if(value.trim().indexOf('SUM') == 0) {
                let elements = document.querySelectorAll(selector);
                sum = 0;
                elements.forEach(el => {
                    let tmpValue = el.getValue(el);
                    tmpValue = Number(tmpValue);
                    if(!Number.isNaN(tmpValue)) {
                        sum += tmpValue;
                    }
                });
            }
        }
        return sum;
    },


    setCalcationResult: function(ele) {
        const { isRealtime } = crud.getAttr(ele);
        let data_calculation = ele.getAttribute('calculate');

        let calString = this.replaceIdWithValue(data_calculation);

        if(calString) {
            let result = calculation(calString);
            
            if (ele.setValue) {
                ele.setValue(ele, result)
				if (isRealtime != "false") {
                    elements.save(ele);
                } 
            }
            
            //. set custom event
            var event = new CustomEvent('changedCalcValue', {
                bubbles: true,
            });
            ele.dispatchEvent(event);
        }

    },

    replaceIdWithValue: function(data_calculation) {
        let ids = this.getIds(data_calculation);

        for(let i = 0; i < ids.length; i++) {
            let id = ids[i];

            let input = null;

            try {
                input = document.querySelector(id);
            }
            catch(error) { input = null; }

            let value = null;
            if(input) {
                value = Number(input.getValue(input));
            }
            else {
                value = this.calculationSpecialOperator(id);
            }

            if(value != null && !Number.isNaN(value)) {
                data_calculation = data_calculation.replaceAll('{' + id + '}', value);
            }
        }

        return data_calculation;
    },

    getIds: function(string) {
        let tmp = string;

        let ids = [];
        if(!tmp) return ids;
        while(tmp.length > 0) {
            let firstIndex = tmp.indexOf('{');
            let secondIndex = tmp.indexOf('}', firstIndex);

            if(firstIndex > -1 && secondIndex > -1) {
                let id = tmp.substring(firstIndex + 1, secondIndex);

                if(ids.indexOf(id) == -1) ids.push(id);

                tmp = tmp.substring(secondIndex + 1);

            }
            else {
                return ids;
            }
        }

        return ids;
    },
};

function calculation(string) {
    if(!string.match(/[a-z_]/i))
        return eval(string);
}

CoCreateCalculation.init();


CoCreateObserver.init({
    name: 'CoCreateCalculationChangeValue',
    observe: ['attributes'],
    attributeName: ['calculate'],
    callback: function(mutation) {
        CoCreateCalculation.setCalcationResult(mutation.target);
    }
});

CoCreateObserver.init({
    name: 'CoCreateCalculationInit',
    observe: ['addedNodes'],
    target: '[calculate]',
    callback: function(mutation) {
        CoCreateCalculation.initElement(mutation.target);
    }
});

export default CoCreateCalculation;
