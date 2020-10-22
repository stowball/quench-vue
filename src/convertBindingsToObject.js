import arrayFrom from './utils/arrayFrom';

const parseString = (str) => {
  try {
    return JSON.parse(str);
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
      const [ , name, index, key, value ] = /(\w+)(?:\[(\d+)\])?(?:\.(\w+))?\s*=\s*(.*?)\s*-->/.exec(binding);
      const parsedValue = parseString(value);

      if (index) {
        obj[name] = obj[name] || [];

        if (key) {
          obj[name][index] = obj[name][index] || {};
          obj[name][index][key] = parsedValue;
        }
        else {
          obj[name][index] = parsedValue;
        }
      }
      else if (key) {
        obj[name] = obj[name] || {};
        obj[name][key] = parsedValue;
      }
      else {
        obj[name] = parsedValue;
      }

      return obj;
    }, dataObj);
  }

  return arrayFrom(elementBindings).reduce((obj, binding) => {
    const bindingValue = binding.attributes['q-binding'].value;

    if (!bindingValue) {
      return obj;
    }

    const parsedValue = parseString(binding.textContent);

    if (bindingValue.indexOf(' as ') > 0) {
      const [ , name, index, key ] = /(\w+)(?:\[(\d+)\])?(?:\.(\w+))?\s+as\s+\w+/.exec(bindingValue);

      if (index) {
        obj[name] = obj[name] || [];

        if (key) {
          obj[name][index] = obj[name][index] || {};
          obj[name][index][key] = parsedValue;
        }
        else {
          obj[name][index] = parsedValue;
        }
      }
      else if (key) {
        obj[name] = obj[name] || {};
        obj[name][key] = parsedValue;
      }
    }
    else if (binding.textContent) {
      obj[bindingValue] = parsedValue;
    }

    return obj;
  }, dataObj);
};

export default convertBindingsToObject;
