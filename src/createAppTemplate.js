const createAppTemplate = (app, template) => {
  const hadClassName = app.attributes.class;
  const quenchedClassName = `${app.className} quenched`.replace(/\bpre-quench\b/g, '');

  let html = app.outerHTML
    .replace(/<!--\s*<q>\s*-->[\s\S]*?<!--\s*<\/q>\s*-->/g, '')
    .replace(/<!--\s*q-binding:.*?-->/g, '')
    .replace(/\sq-binding=".*?\s+as\s+/g, ' q-binding="')
    .replace(/q-binding="/g, 'v-text="')
    .replace(/(\sv-(text|html).*?>)[\s\S]*?<\//g, '$1</')
    .replace(/(?:<!--\s*)?<q-template><\/q-template>(\s*-->)?/, template || '');

  if (hadClassName) {
    html = html.replace(/(class=").*?"/, `$1${quenchedClassName}"`);
  }
  else {
    html = html.replace(/(<.*?\s)/, `$1class="${quenchedClassName}"`);
  }

  return html;
};

export default createAppTemplate;
