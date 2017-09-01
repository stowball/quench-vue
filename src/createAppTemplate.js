const createAppTemplate = (app) => {
  const hadClassName = app.attributes.class;
  const quenchedClassName = `${app.className} quenched`.replace(/\bpre-quench\b/g, '');

  let html = app.outerHTML
    .replace(/<!--\s*<q>\s*-->[\s\S]*?<!--\s*<\/q>\s*-->/g, '')
    .replace(/ q-binding=".*?\s+as\s+/g, ' q-binding="')
    .replace(/ q-binding="(.*?)"(.*?)>[\s\S]*?<\//g, '$2>{{ $1 }}</');

  if (hadClassName) {
    html = html.replace(/(class=").*?"/, `$1${quenchedClassName}"`);
  }
  else {
    html = html.replace(/(<.*?\s)/, `$1class="${quenchedClassName}"`);
  }

  return html;
};

export default createAppTemplate;
