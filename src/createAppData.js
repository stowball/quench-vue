import convertBindingsToObject from './convertBindingsToObject';
import convertDataToObject from './convertDataToObject';
import objectAssign from './utils/objectAssign';

const createAppData = (app) => {
  if (app) {
    return objectAssign({}, convertBindingsToObject(app), convertDataToObject(app));
  }

  return {};
};

export default createAppData;
