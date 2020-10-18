import expect from 'expect';
import createAppData from 'src/createAppData';

describe('createAppData', () => {
  it('returns an empty object if app isn’t passed', () => {
    expect(createAppData()).toEqual({});
  });

  it('returns an empty object if no bindings or data to convert', () => {
    const app = document.createElement('div');
    expect(createAppData(app)).toEqual({});
  });

  it('returns an object of bindings', () => {
    const app = document.createElement('div');
    app.setAttribute('q-convert-bindings', true);
    app.innerHTML = '<!-- q-binding:foo = "bar" -->';
    expect(createAppData(app)).toEqual({
      foo: 'bar',
    });
  });

  it('returns an object of data', () => {
    const app = document.createElement('div');
    app.setAttribute('q-data', `{
      "foo": "bar"
    }`);
    expect(createAppData(app)).toEqual({
      foo: 'bar',
    });
  });

  it('returns 1 merged object with bindings overwritten by data', () => {
    const app = document.createElement('div');
    app.setAttribute('q-convert-bindings', true);
    app.innerHTML = '<!-- q-binding:foo = "bar" -->';
    app.setAttribute('q-data', `{
      "foo": "baz"
    }`);
    expect(createAppData(app)).toEqual({
      foo: 'baz',
    });
  });
});
