import convertBindingsToObject from './convertBindingsToObject';
import convertDataToObject from './convertDataToObject';
import objectAssign from './utils/objectAssign';

const createAppData = (app) => objectAssign({}, convertBindingsToObject(app), convertDataToObject(app));

export default createAppData;
