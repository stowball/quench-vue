const convertDataToObject = (app) => {
  if (app.dataset.qData) {
    return JSON.parse(app.dataset.qData);
  }

  return;
}

export default convertDataToObject;
