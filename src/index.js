import CoCreateObserver from '@cocreate/observer'
import crdt from '@cocreate/crdt'
import crud from '@cocreate/crud-client'
import CoCreateInput from '@cocreate/input'
import floatingLabel from '@cocreate/floating-label'
import htmltags from '@cocreate/htmltags'

var CoCreateCalculation = {
  init: function(){
     let calculationElements = document.querySelectorAll('[data-calculation]')
      this.initElements(calculationElements)
  },
  
  initElements: function(elements) {
    for(let el of elements)
       this.initElement(el);  
  },
  
  initElement: function(ele) {
    
      const self = this;
      let data_calculation = ele.getAttribute('data-calculation');
      let ids = this.getIds(data_calculation);

      let selectors = [];
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        
        let input = null;
        try {
          input = document.querySelector(id);
        } catch (error) { input = null; }
        
        if (input) {
          input.addEventListener('input', function() {
            self.setCalcationResult(ele);
          })
          
          input.addEventListener('CoCreateInput-setvalue', function() {
              // self.setCalcationResult(ele)
          })
          
          if (input.hasAttribute('data-calculation')) {
            input.addEventListener('changedCalcValue', function(e) {
              self.setCalcationResult(ele)
            })
          }
          
        } else {
          //. add event of special operator
          
          let selector = this.__getOperatorSelector(id);
          if (selector) {
            selectors.push(selector)
          }
        }
            self.setCalcationResult(ele);
      }
      
      if (selectors.length === 0) {
            self.setCalcationResult(ele);
      }
      if (selectors.length > 0) {
        document.addEventListener('changedCalcValue', function(e) {

          let isMatched = false;
          selectors.forEach(selector => {
            if (e.target.matches(selector)) {
              isMatched = true; return;
            }
          })

          if (isMatched) {
            self.setCalcationResult(ele);
          }
        })
      }
  },
  
  __getOperatorSelector(value) {
    let result = /SUM\(\s*([\w\W]+)\s*\)/g.exec(value);
    if (result && result[1]) {
      return result[1].trim();
    }
    return null;
  },
  
  calculationSpecialOperator(value) {
    let self = this;
    let sum = null;
    let result = /SUM\(\s*([\w\W]+)\s*\)/g.exec(value);
    if (result) {
      let selector = result[1].trim()
      
      if (value.trim().indexOf('SUM') == 0) {
        let elements = document.querySelectorAll(selector)
        sum = 0;
        elements.forEach(el => {
          let tmpValue = self.__getElementValue(el);
          tmpValue = Number(tmpValue);
          if (!Number.isNaN(tmpValue)) {
            sum += tmpValue;
          }
        })
      }
    } 
    return sum
  },
  
    
  setCalcationResult: function(ele) {
    let data_calculation = ele.getAttribute('data-calculation');
    
    let calString = this.replaceIdWithValue(data_calculation);
    
    if (calString) {
      let result = calculation(calString);
      if (ele.tagName == 'INPUT' || ele.tagName == 'TEXTAREA' || ele.tagName == 'SELECT') {
        ele.value = result
        
        if (crud.isCRDT(ele)) {
          ele.value = "";
          crdt.replaceText({
            collection: ele.getAttribute('data-collection'),
            document_id: ele.getAttribute('data-document_id'),
            name: ele.getAttribute('name'),
            value: result.toString()
          })
        } else {
          CoCreateInput.save(ele);
        }
        
        if (floatingLabel)   {
          floatingLabel.update(ele, ele.value)
        }
      } else {
        ele.innerHTML = result;
        // htmltags.saveContent(ele);
        htmltags.save(ele)
      }
      
      //. set custom event
      var event = new CustomEvent('changedCalcValue', {
        bubbles: true,
      })
      ele.dispatchEvent(event);
    }
    
  },
  
  __getElementValue: function(element) {
    if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA' || element.tagName == 'SELECT') {
      return element.value;
    } else {
      return element.innerHTML;
    }
  },
    
  replaceIdWithValue: function(data_calculation) {
    let ids = this.getIds(data_calculation);

    for (let i=0; i < ids.length; i++) {
      let id = ids[i];
      
      let input = null;
      
      try {
        input = document.querySelector(id);
      } catch (error) { input = null; }
      
      let value = null;
      if (input) {
        value = Number(this.__getElementValue(input));
      } else {
        value = this.calculationSpecialOperator(id);
      }
      
      if (value != null && !Number.isNaN(value)) {
        data_calculation = data_calculation.replaceAll('{' + id + '}', value);
      }
    }
    
    return data_calculation;
  },
    
  getIds: function(string) {
    let tmp = string;
    
    let ids = []
    if (!tmp) return ids;
    while (tmp.length > 0) {
      let firstIndex = tmp.indexOf('{');
      let secondIndex = tmp.indexOf('}', firstIndex);
      
      if (firstIndex > -1 && secondIndex > -1) {
        let id = tmp.substring(firstIndex + 1, secondIndex);
        
        if (ids.indexOf(id) == -1) ids.push(id);
  
        tmp = tmp.substring(secondIndex + 1);
        
      } else {
        return ids;
      }
    }
    
    return ids;
  },
}

function calculation(string) {
  let index1, index2, index3, index4;
  
  index1 = string.indexOf('+');
  index2 = string.indexOf('-');
  index3 = string.indexOf('*');
  index4 = string.indexOf('/');
  
  
  if (index1 > -1) {
    let lStr = string.substr(0, index1);
    let rStr = string.substr(index1 + 1);
    
    return calculation(lStr) + calculation(rStr);
    
  } else if (index2 > -1) {
    let lStr = string.substr(0, index2);
    let rStr = string.substr(index2 + 1);
    
    return calculation(lStr) - calculation(rStr);
    
  } else if (index3 > -1) {
    let lStr = string.substr(0, index3);
    let rStr = string.substr(index3 + 1);
    
    return calculation(lStr) * calculation(rStr);
  } else if (index4 > -1) {
    let lStr = string.substr(0, index4);
    let rStr = string.substr(index4 + 1);
    
    let lValue = calculation(lStr);
    let rValue = calculation(rStr);
    
    if (rValue == 0) {
      return 0;
    } else {
      return lValue / rValue;
    }
    
  } else {
    let result = Number(string);
    
    if (isNaN(result)) {
      return 0; 
    } else {
      return result;
    }
    
    
  }
  
}

CoCreateCalculation.init();


CoCreateObserver.init({ 
	name: 'CoCreateCalculationChangeValue', 
	observe: ['attributes'],
	attributeName: ['data-calculation'],
	callback: function(mutation) {
    CoCreateCalculation.setCalcationResult(mutation.target);
	}
});

CoCreateObserver.init({ 
	name: 'CoCreateCalculationInit', 
	observe: ['addedNodes'],
  target: '[data-calculation]',
	callback: function(mutation) { 
		CoCreateCalculation.initElement(mutation.target)
	}
});

export default CoCreateCalculation;