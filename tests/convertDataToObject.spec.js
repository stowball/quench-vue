import expect from 'expect';
import convertDataToObject from '../src/convertDataToObject';

describe('convertDataToObject', () => {
  describe('q-data', () => {
    it('converts a valid string to an equal object', () => {
      const app = document.createElement('div');
      app.setAttribute('q-data', `{
        "foo": "bar",
        "baz": true,
        "qux": 1,
        "corge": [1, 2, 3],
        "grault": { "waldo": false }
      }`);
      const result = convertDataToObject(app);
      expect(result).toEqual({
        "foo": "bar",
        "baz": true,
        "qux": 1,
        "corge": [1, 2, 3],
        "grault": { "waldo": false },
      });
    });

    it('returns an empty object for an invalid string', () => {
      const app = document.createElement('div');
      app.setAttribute('q-data', `{
        foo: "bar",
        baz: true,
        qux: 1,
        corge: [1, 2, 3],
        grault: { waldo: false }
      }`);
      const result = convertDataToObject(app);
      expect(result).toEqual({});
    });
  });

  describe('q-r-data', () => {
    beforeEach(() => {
      window.foo = undefined;
      window.baz = undefined;
      window.qux = undefined;
      window.corge = undefined;
      window.grault = undefined;
    });

    it('returns an object matching top-level, global variables for a valid string', () => {
      window.foo = 'bar';
      window.baz = true;
      window.qux = 1;
      window.corge = [1, 2, 3];
      window.grault = null;

      const app = document.createElement('div');
      app.setAttribute('q-r-data', `{
        "foo": "foo",
        "baz": "baz",
        "qux": "qux",
        "corge": "corge",
        "grault": "grault",
        "plugh": "plugh"
      }`);
      const result = convertDataToObject(app);
      expect(result).toEqual({
        "foo": "bar",
        "baz": true,
        "qux": 1,
        "corge": [1, 2, 3],
        "grault": null,
        "plugh": undefined
      });
    });

    it('returns an empty object for an invalid string', () => {
      const app = document.createElement('div');
      app.setAttribute('q-r-data', `{
        foo: "foo",
        baz: "baz",
        qux: "qux",
        corge: "corge",
        grault: "grault"
      }`);
      const result = convertDataToObject(app);
      expect(result).toEqual({});
    });

    it('converts dot notation appropriate global variables', () => {
      window.foo = {
        bar: true,
        baz: {
          qux: 1,
          corge: [1, 2, 3],
          grault: {
            fred: false,
          },
        },
      };

      const app = document.createElement('div');
      app.setAttribute('q-r-data', `{
        "bar": "foo.bar",
        "bazQux": "foo.baz.qux",
        "bazCorge": "foo.baz.corge",
        "bazGraultFred": "foo.baz.grault.fred"
      }`);
      const result = convertDataToObject(app);
      expect(result).toEqual({
        "bar": true,
        "bazQux": 1,
        "bazCorge": [1, 2, 3],
        "bazGraultFred": false,
      });
    });

    it('overrides any q-data values', () => {
      window.foo = {
        bar: true,
        baz: {
          qux: 2,
          corge: [1, 2, 3],
          grault: {
            fred: null,
          },
        },
      };

      const app = document.createElement('div');
      app.setAttribute('q-data', `{
        "foo": "bar",
        "baz": true,
        "qux": 1,
        "corge": [1, 2, 3],
        "grault": { "waldo": false }
      }`);
      app.setAttribute('q-r-data', `{
        "bar": "foo.bar",
        "baz": "foo.baz.qux",
        "bazCorge": "foo.baz.corge",
        "grault": "foo.baz.grault.fred"
      }`);
      const result = convertDataToObject(app);
      expect(result).toEqual({
        "foo": "bar",
        "bar": true,
        "baz": 2,
        "bazCorge": [1, 2, 3],
        "qux": 1,
        "corge": [1, 2, 3],
        "grault": null
      });
    });
  });
});
