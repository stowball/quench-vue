const createAppTemplate = (app) =>
  app
    .innerHTML
    .replace(/<!--\s*<v>\s*-->[\s\S]*?<!--\s*<\/v>\s*-->/g, '')
    .replace(/ data-q-convert-binding=".*?"/g, '')
    .replace(/ data-q-binding=".*?as\s+/g, ' data-q-binding="')
    .replace(/ data-q-binding="(.*?)"(.*?)>[\s\S]*?<\//g, "$2>{{ $1 }}</");

export default createAppTemplate;
