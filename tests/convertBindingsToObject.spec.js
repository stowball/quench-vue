import expect from 'expect';
import convertBindingsToObject from 'src/convertBindingsToObject';

describe('convertBindingsToObject', () => {
  it('returns undefined when [q-convert-bindings] is absent', () => {
    const app = document.createElement('div');
    const result = convertBindingsToObject(app);
    expect(result).toEqual(undefined);
  });

  describe('comment bindings', () => {
    const app = document.createElement('div');
    app.setAttribute('q-convert-bindings', true);

    describe('simple', () => {
      it('converts an unquoted string', () => {
        app.innerHTML = '<!-- q-binding:foo = bar -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: 'bar',
        });
      });

      it('converts an "quoted" string', () => {
        app.innerHTML = '<!-- q-binding:foo = "bar" -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: 'bar',
        });
      });

      it('converts an integer', () => {
        app.innerHTML = '<!-- q-binding:foo = 1 -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: 1,
        });
      });

      it('converts a float', () => {
        app.innerHTML = '<!-- q-binding:foo = 1.2 -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: 1.2 ,
        });
      });

      it('converts an array', () => {
        app.innerHTML = '<!-- q-binding:foo = ["bar", 1] -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: ['bar', 1],
        });
      });

      it('converts an object', () => {
        app.innerHTML = '<!-- q-binding:foo = { "bar": "baz" } -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: { bar: 'baz' },
        });
      });
    });

    describe('objects', () => {
      it('converts object keys', () => {
        app.innerHTML = `
          <!-- q-binding:foo.bar = "baz" -->
          <!-- q-binding:foo.qux = 1 -->
        `;
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: {
            bar: 'baz',
            qux: 1,
          },
        });
      });
    });

    describe('arrays', () => {
      it('converts array indices', () => {
        app.innerHTML = `
          <!-- q-binding:foo[0] = "bar" -->
          <!-- q-binding:foo[1] = 1 -->
        `;
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: ['bar', 1],
        });
      });

      it('converts arrays of objects', () => {
        app.innerHTML = `
          <!-- q-binding:foo[0].bar = "baz" -->
          <!-- q-binding:foo[0].qux = 1 -->
        `;
        const result = convertBindingsToObject(app);
        expect(result).toEqual({
          foo: [{
            bar: 'baz',
            qux: 1,
          }],
        });
      });
    });

    describe('malformed', () => {
      it('returns an empty object when no dataPropertyName or value exists', () => {
        app.innerHTML = '<!-- q-binding -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({});
      });

      it('returns an empty object when no dataPropertyName', () => {
        app.innerHTML = '<!-- q-binding="foo" -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({});
      });

      it('returns an empty object when no value exists', () => {
        app.innerHTML = '<!-- q-binding:foo -->';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({});
      });
    });
  });

  describe('tag bindings', () => {
    const app = document.createElement('div');
    app.setAttribute('q-convert-bindings', true);

    it('converts a simple variable', () => {
      app.innerHTML = '<div q-binding="foo">bar</div>';
      const result = convertBindingsToObject(app);
      expect(result).toEqual({
        foo: 'bar',
      });
    });

    it('converts an array', () => {
      app.innerHTML = `
        <div q-binding="foos[0] as foo">bar</div>
        <div q-binding="foos[1] as foo">1</div>
      `;
      const result = convertBindingsToObject(app);
      expect(result).toEqual({
        foos: ['bar', 1],
      });
    });

    it('converts an object', () => {
      app.innerHTML = `
        <div q-binding="foo.bar as key">baz</div>
        <div q-binding="foo.qux as key">1</div>
      `;
      const result = convertBindingsToObject(app);
      expect(result).toEqual({
        foo: {
          bar: 'baz',
          qux: 1,
        },
      });
    });

    it('converts an array of objects', () => {
      app.innerHTML = `
        <div q-binding="foos[0].bar as foo.bar">baz</div>
        <div q-binding="foos[0].qux as foo.qux">1</div>
      `;
      const result = convertBindingsToObject(app);
      expect(result).toEqual({
        foos: [{
          bar: 'baz',
          qux: 1,
        }],
      });
    });

    it('overrides any comment bindings', () => {
      app.innerHTML = `
        <!-- q-binding:foo = bar -->
        <div q-binding="foo">baz</div>
      `;
      const result = convertBindingsToObject(app);
      expect(result).toEqual({
        foo: 'baz',
      });
    });

    describe('malformed', () => {
      it('returns an empty object when no binding value exists', () => {
        app.innerHTML = '<div q-binding>foo</div>';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({});
      });

      it('returns an empty object when no textContent exists', () => {
        app.innerHTML = '<div q-binding="foo"></div>';
        const result = convertBindingsToObject(app);
        expect(result).toEqual({});
      });
    });
  });
});
