import _objectAssign from './utils/objectAssign';

const convertDataToObject = (app) => {
  let data;
  let rData;

  if (app.attributes['q-data']) {
    try {
      data = JSON.parse(app.attributes['q-data'].value);
    }
    catch (e) {
      // Do nothing
    }
  }

  if (app.attributes['q-r-data']) {
    try {
      rData = JSON.parse(app.attributes['q-r-data'].value);

      Object.keys(rData).forEach((key) => {
        const keyArray = rData[key].split('.');
        const initKeyValue = window[keyArray[0]];
        const keyValue = initKeyValue && keyArray.length > 1 ?
        // eslint-disable-next-line arrow-body-style
          keyArray.reduce((obj, newKey, index) => {
            return obj[newKey] || (index === keyArray.length - 1 ? undefined : obj);
          }, initKeyValue)
          : initKeyValue;

        rData[key] = keyValue;
      });
    }
    catch (e) {
      // Do nothing
    }
  }

  return _objectAssign({}, data, rData);
};

export default convertDataToObject;
