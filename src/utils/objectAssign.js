export default Object.assign || function (target) {
  for (let i = 1; i < arguments.length; i++) {
    const source = arguments[i];

    for (let key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
