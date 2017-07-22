import _arrayFrom from './utils/arrayFrom';

const convertBindingsToObject = (app) => {
  if (app.attributes['q-convert-bindings']) {
    const bindings = app.querySelectorAll('[q-binding]');

    return _arrayFrom(bindings).reduce((obj, binding) => {
      const bindingValue = binding.attributes['q-binding'].value;

      if (bindingValue.indexOf(' as ') > 0) {
        if (bindingValue.indexOf('[') > 0) {
          const [ , name, index, dot, prop ] = /(\w+)\[(\d+)\](\.)?(.*)/.exec(bindingValue);

          obj[name] = obj[name] || [];

          if (dot) {
            obj[name][index] = obj[name][index] || {};

            obj[name][index][prop.split(' as ')[0]] = binding.textContent;
          }
          else {
            obj[name][index] = binding.textContent;
          }
        }
        else {
          const [ , name, prop ] = /(\w+)\.(\w+)\s.*/.exec(bindingValue);

          obj[name] = obj[name] || {};
          obj[name][prop] = binding.textContent;
        }
      }
      else if (binding.textContent) {
        obj[bindingValue] = binding.textContent;
      }

      return obj;
    }, {});
  }
};

export default convertBindingsToObject;
