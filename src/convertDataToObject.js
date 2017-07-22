const convertDataToObject = (app) => {
  if (app.attributes['q-data']) {
    return JSON.parse(app.attributes['q-data'].value);
  }
}

export default convertDataToObject;
