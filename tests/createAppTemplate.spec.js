import expect from 'expect';
import createAppTemplate from '../src/createAppTemplate';

describe('createAppTemplate', () => {
  it('adds the quenched class', () => {
    const app = document.createElement('div');
    app.id = 'a';
    const result = createAppTemplate(app);
    expect(result).toEqual('<div class=" quenched"id="a"></div>');
  });

  it('removes the pre-quench class on single line class', () => {
    const app = document.createElement('div');
    app.className = 'foo pre-quench bar';
    const result = createAppTemplate(app);
    expect(result).toEqual('<div class="foo  bar quenched"></div>');
  });

  it('removes the pre-quench class on multi line class', () => {
    const app = document.createElement('div');
    app.className = `
      foo
      pre-quench
      bar
    `;
    const result = createAppTemplate(app);
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('removes all <q> comments and content within', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <!-- <q> -->
      <section>
      </section>
      <!-- </q> -->

      <!-- <q> -->
      <span>
      </span>
      <!-- </q> -->
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<!-- <q> -->');
    expect(result).toNotContain('<!-- </q> -->');
    expect(result).toNotContain('<section>');
    expect(result).toNotContain('</section>');
    expect(result).toNotContain('<span>');
    expect(result).toNotContain('</span>');
  });

  it('removes all q-binding comments', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <!-- q-binding:arr = [1, 2] -->
      <!-- q-binding:obj = { "foo": "bar", "baz": "qux" } -->
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<!-- q-binding:arr = [1, 2] -->');
    expect(result).toNotContain('<!-- q-binding:obj = { "foo": "bar", "baz": "qux" } -->');
  });

  it('removes inner content from v-text bindings', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <p v-text="foo">bar</p>
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<p v-text="foo">bar</p>');
    expect(result).toContain('<p v-text="foo"></p>');
  });

  it('removes inner content from v-html bindings', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <p v-html="foo">bar</p>
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<p v-html="foo">bar</p>');
    expect(result).toContain('<p v-html="foo"></p>');
  });

  it('converts simple q-binding to v-text', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <p q-binding="foo">bar</p>
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<p q-binding="foo">bar</p>');
    expect(result).toContain('<p v-text="foo"></p>');
  });

  it('converts complex q-binding as to v-text', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <p q-binding="foo[bar].baz as qux.corge">grault</p>
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<p q-binding="foo[bar].baz as qux.corge">grault</p>');
    expect(result).toContain('<p v-text="qux.corge"></p>');
  });

  it('removes q-template tags with no template', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <q-template></q-template>
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<q-template></q-template>');
  });

  it('removes commented q-template tags with no template', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <!-- <q-template></q-template> -->
    `;
    const result = createAppTemplate(app);
    expect(result).toNotContain('<q-template></q-template>');
  });

  it('replaces q-template tags with additional template', () => {
    const app = document.createElement('div');
    app.className = '';
    app.innerHTML = `
      <q-template></q-template>
    `;
    const result = createAppTemplate(app, '<div>foo</div>');
    expect(result).toNotContain('<q-template></q-template>');
    expect(result).toContain('<div>foo</div>');
  });
});
