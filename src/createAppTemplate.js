const createAppTemplate = (app, template) => {
  if (!app) {
    return;
  }

  const quenchedClassName = `${app.className} quenched`.replace(/\bpre-quench\b/g, '');
  const html = app.outerHTML
    .replace(/<!--\s*<q>\s*-->[\s\S]*?<!--\s*<\/q>\s*-->/g, '')
    .replace(/<!--\s*q-binding:.*?-->/g, '')
    .replace(/\sq-binding=".*?\s+as\s+/g, ' q-binding="')
    .replace(/q-binding="/g, 'v-text="')
    .replace(/(\sv-(text|html).*?>)[\s\S]*?<\//g, '$1</')
    .replace(/(?:<!--\s*)?<q-template><\/q-template>(\s*-->)?/, template || '');

  if (app.hasAttribute('class')) {
    return html.replace(/(class=")[\s\S]*?"/, `$1${quenchedClassName}"`);
  }

  return html.replace(/(<.*?\s)/, `$1class="${quenchedClassName}"`);
};

export default createAppTemplate;
