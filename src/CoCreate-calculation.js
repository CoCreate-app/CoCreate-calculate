var CoCreateCalculation = {
  init: function() {
    this.initCalculationElements();
  },
    
    
  initCalculationElements: function(container) {
    const mainContainer = container || document;
    if (!mainContainer.querySelectorAll) {
      return;
    }
    let calculationElements = mainContainer.querySelectorAll('[data-calculation]') || [];
    calculationElements = Array.from(calculationElements);
    
    if (mainContainer != document && mainContainer.hasAttribute('data-calculation')) {
      calculationElements.push(mainContainer);  
    }
    
    for (let i=0; i<calculationElements.length; i++) {
    	if (CoCreate.observer.getInitialized(calculationElements[i], "calculation_init")) {
  			return;
  		}
  		CoCreate.observer.setInitialized(calculationElements[i], "calculation_init")
  		
      this.initCalculationElement(calculationElements[i]);  
    }
    
  },
    
  initCalculationElement: function(ele) {
    
      const self = this;
      let data_calculation = ele.getAttribute('data-calculation');
      let ids = this.getIds(data_calculation); 
      
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        
        let input = document.getElementById(id);
        if (input) {
          input.addEventListener('input', function() {
            self.setCalcationResult(ele);
          })
          
          input.addEventListener('CoCreateInput-setvalue', function() {
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
              self.setCalcationResult(ele)
          })
          
        }
      }
      
  },
  
    
  setCalcationResult: function(ele) {
    let data_calculation = ele.getAttribute('data-calculation');
    
    let calString = this.replaceIdWithValue(data_calculation);
    
    console.log(calString);
    if (calString) {
      let result = calculation(calString);
      if (ele.tagName == 'INPUT' || ele.tagName == 'TEXTAREA' || ele.tagName == 'SELECT') {
        ele.value = result
        // if (window.CoCreateInput) {
        //   window.CoCreateInput.save(ele)
        // }
      } else {
        ele.innerHTML = result;
        // if (window.CoCreateHtmlTags) {
        //   window.CoCreateHtmlTags.save(ele);
        // }
      }
    }
    
  },
    
  replaceIdWithValue: function(data_calculation) {
    let ids = this.getIds(data_calculation);
    
    for (let i=0; i < ids.length; i++) {
      let id = ids[i];
      
      let input = document.getElementById(id);
      if (input) {
        let value = Number(input.value);
      
        data_calculation = data_calculation.replace(new RegExp('{' + id + '}', 'g'), value);   
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

CoCreate.observer.init({ 
	name: 'CoCreateCalculationChangeValue', 
	observe: ['attributes'],
	attributes: ['value'],
  include: 'input',
	callback: function(mutation) {
	  console.log('-----------------------------------------------------')
		console.log(mutation.target)
	}
});

CoCreate.observer.init({ 
	name: 'CoCreateCalculationInit', 
	observe: ['subtree', 'childList'],
  include: '[data-calculation]',
	callback: function(mutation) {
		CoCreateCalculation.initCalculationElements(mutation.target)
	}
});

export default CoCreateCalculation;