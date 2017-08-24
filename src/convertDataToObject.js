import _objectAssign from './utils/objectAssign';

const convertDataToObject = (app) => {
  let data;
  let rData;

  if (app.attributes['q-data']) {
    data = JSON.parse(app.attributes['q-data'].value);
  }

  if (app.attributes['q-r-data']) {
    rData = JSON.parse(app.attributes['q-r-data'].value);

    Object.keys(rData).forEach((key) => {
      rData[key] = window[rData[key]];
    });
  }

  return _objectAssign({}, data, rData);
}

export default convertDataToObject;
