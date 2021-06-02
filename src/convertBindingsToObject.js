import _arrayFrom from './utils/arrayFrom';

const parseString = (str) => {
  const decoded = (new DOMParser()).parseFromString(str, 'text/html').body.firstChild;

  try {
    return JSON.parse(decoded);
  }
  catch (e) {
    return str;
  }
};

const convertBindingsToObject = (app) => {
  if (!app.attributes['q-convert-bindings']) {
    return;
  }

  const commentBindings = app.innerHTML.match(/<!--\s*q-binding:\w+\[?(\d+)?\]?(\.\w+)?\s*=\s*.*?\s*-->/g);
  const elementBindings = app.querySelectorAll('[q-binding]');
  let dataObj = {};

  if (commentBindings) {
    dataObj = commentBindings.reduce((obj, binding) => {
      const [ , name, index, dot, prop, value ] = /(\w+)\[?(\d+)?\]?(\.(\w+))?\s*=\s*(.*?)\s*-->/.exec(binding);
      const parsedValue = parseString(value);

      if (index) {
        obj[name] = obj[name] || [];

        if (dot) {
          obj[name][index] = obj[name][index] || {};

          obj[name][index][prop] = parsedValue;
        }
        else {
          obj[name][index] = parsedValue;
        }
      }
      else if (dot) {
        obj[name] = obj[name] || {};

        obj[name][prop] = parsedValue;
      }
      else {
        obj[name] = parsedValue;
      }

      return obj;
    }, dataObj);
  }

  return _arrayFrom(elementBindings).reduce((obj, binding) => {
    const bindingValue = binding.attributes['q-binding'].value;
    const parsedValue = parseString(binding.textContent);

    if (bindingValue.indexOf(' as ') > 0) {
      if (bindingValue.indexOf('[') > 0) {
        const [ , name, index, dot, prop ] = /(\w+)\[(\d+)\](\.)?(.*)/.exec(bindingValue);

        obj[name] = obj[name] || [];

        if (dot) {
          obj[name][index] = obj[name][index] || {};

          obj[name][index][prop.split(' as ')[0].trim()] = parsedValue;
        }
        else {
          obj[name][index] = parsedValue;
        }
      }
      else {
        const [ , name, prop ] = /(\w+)\.(\w+)\s.*/.exec(bindingValue);

        obj[name] = obj[name] || {};
        obj[name][prop] = parsedValue;
      }
    }
    else if (binding.textContent) {
      obj[bindingValue] = parsedValue;
    }

    return obj;
  }, dataObj);
};

export default convertBindingsToObject;
