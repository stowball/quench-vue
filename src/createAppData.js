import convertBindingsToObject from './convertBindingsToObject';
import convertDataToObject from './convertDataToObject';
import _objectAssign from './utils/objectAssign';

const createAppData = (app) => _objectAssign({}, convertBindingsToObject(app), convertDataToObject(app));

export default createAppData;
