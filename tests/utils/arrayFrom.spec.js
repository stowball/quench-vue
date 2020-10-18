import expect from 'expect';
import arrayFrom from 'src/utils/arrayFrom';

describe('arrayFrom', () => {
  beforeEach(() => {
    window.Array.from = undefined;
  });

  it('returns an array of equal length to DOM nodes', () => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');

    document.body.appendChild(div1);
    document.body.appendChild(div2);

    const divs = document.getElementsByTagName('div');

    expect(Array.isArray(arrayFrom(divs))).toEqual(true);
    expect(arrayFrom(divs).length).toEqual(2);

    document.body.removeChild(div1);
    document.body.removeChild(div2);
  });

  it('returns an empty array for a boolean', () => {
    expect(arrayFrom(true)).toEqual([]);
  });

  it('returns an empty array for a number', () => {
    expect(arrayFrom(1)).toEqual([]);
  });

  it('returns an empty array for an object', () => {
    expect(arrayFrom({ foo: 'bar' })).toEqual([]);
  });

  it('returns an array of characters for a string', () => {
    expect(arrayFrom('')).toEqual([]);
    expect(arrayFrom('abc')).toEqual(['a', 'b', 'c']);
  });
});
