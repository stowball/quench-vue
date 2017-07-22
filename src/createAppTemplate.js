const createAppTemplate = (app) => (
  app
    .innerHTML
    .replace(/<!--\s*<q>\s*-->[\s\S]*?<!--\s*<\/q>\s*-->/g, '')
    .replace(/ q-binding=".*?as\s+/g, ' q-binding="')
    .replace(/ q-binding="(.*?)"(.*?)>[\s\S]*?<\//g, "$2>{{ $1 }}</")
);

export default createAppTemplate;
