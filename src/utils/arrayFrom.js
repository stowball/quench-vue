export default Array.from || function (object) {
  return [].slice.call(object);
};
