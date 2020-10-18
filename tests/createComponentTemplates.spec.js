import expect from 'expect';
import createComponentTemplates from 'src/createComponentTemplates';

describe('createComponentTemplates', () => {
  it('returns undefined if app isn’t passed', () => {
    expect(createComponentTemplates(undefined, {})).toEqual(undefined);
  });

  it('returns undefined if components isn’t passed', () => {
    expect(createComponentTemplates(document.body)).toEqual(undefined);
  });

  it('returns unmodified components if template isn’t local', () => {
    const components = {
      foo: {
        template: '<div>foo</div>',
      },
    };
    expect(createComponentTemplates(document.body, components)).toEqual(components);
  });

  it('converts camelCase component name to kebab-case selector & removes selector', () => {
    const components = {
      fooBar: {
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <div q-component="foo-bar"><b>baz</b></div>
    `;
    const result = createComponentTemplates(app, components);
    expect(result).toEqual({
      fooBar: {
        template: '<div ><b>baz</b></div>',
      },
    });
  });

  it('returns innerHTML of <template> q-component', () => {
    const components = {
      foo: {
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <template q-component="foo"><b>bar</b></template>
    `;
    const result = createComponentTemplates(app, components);
    expect(result).toEqual({
      foo: {
        template: '<b>bar</b>',
      },
    });
  });

  it('strips innerText of v-text definition', () => {
    const components = {
      foo: {
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <template q-component="foo"><b v-text="bar">baz</b></template>
    `;
    const result = createComponentTemplates(app, components);
    expect(result).toEqual({
      foo: {
        template: '<b v-text="bar"></b>',
      },
    });
  });

  it('strips innerText of v-html definition', () => {
    const components = {
      foo: {
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <template q-component="foo"><b v-html="bar">baz</b></template>
    `;
    const result = createComponentTemplates(app, components);
    expect(result).toEqual({
      foo: {
        template: '<b v-html="bar"></b>',
      },
    });
  });

  it('strips all content between <q-component> comments', () => {
    const components = {
      foo: {
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <template q-component="foo">
        <!-- <q-component> -->
        <b>bar</b>
        <!-- </q-component> -->
      </template>
    `;
    const result = createComponentTemplates(app, components);
    result.foo.template = result.foo.template.trim();
    expect(result).toEqual({
      foo: {
        template: '',
      },
    });
  });

  it('strips all content between <q-component-partial>s', () => {
    const components = {
      foo: {
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <template q-component="foo">
        <q-component-partial name="bar"></q-component-partial>
        <!-- <q-component-partial name="baz"></q-component-partial> -->
      </template>
    `;
    const result = createComponentTemplates(app, components);
    result.foo.template = result.foo.template.trim();
    expect(result).toEqual({
      foo: {
        template: '',
      },
    });
  });

  it('replaces matched <q-component-partial>s', () => {
    const components = {
      foo: {
        partials: {
          bar: '<div>bar</div>',
          baz: '<div>baz</div>',
        },
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <template q-component="foo">
        <q-component-partial name="bar"></q-component-partial>
        <!-- <q-component-partial name="baz"></q-component-partial> -->
      </template>
    `;
    const result = createComponentTemplates(app, components);
    result.foo.template = result.foo.template.trim();
    expect(result).toEqual({
      foo: {
        partials: {
          bar: '<div>bar</div>',
          baz: '<div>baz</div>',
        },
        template: `<div>bar</div>
        <div>baz</div>`,
      },
    });
  });

  it('handles nested local components', () => {
    const components = {
      foo: {
        components: {
          bar: {
            template: 'local',
          },
        },
        template: 'local',
      },
    };
    const app = document.createElement('div');
    app.innerHTML = `
      <template q-component="foo">
        <div>foo</div><bar></bar>
      </template>
      <template q-component="bar">
        <div>bar</div>
      </template>
    `;
    const result = createComponentTemplates(app, components);
    result.foo.template = result.foo.template.trim();
    result.foo.components.bar.template = result.foo.components.bar.template.trim();
    expect(result).toEqual({
      foo: {
        components: {
          bar: {
            template: '<div>bar</div>',
          },
        },
        template: '<div>foo</div><bar></bar>',
      },
    });
  });
});
