const createComponentTemplates = (app, components) => {
  if (!components) {
    return null;
  }

  Object.keys(components).forEach((key) => {
    const componentEl = app.querySelector(`[q-component="${key}"]`);

    if (componentEl) {
      let template = '';

      template = componentEl.tagName === 'TEMPLATE' ? componentEl.innerHTML : componentEl.outerHTML;
      template = template
        .replace(/(\sv-(text|html).*?>)[\s\S]*?<\//g, '$1</')
        .replace(/<!--\s*<q-component>\s*-->[\s\S]*?<!--\s*<\/q-component>\s*-->/g, '')
        .replace(/(?:<!--\s*)?<q-component-partial\s+name=["'](.*?)["']\s*><\/q-component-partial>(\s*-->)?/g, (match, p1) => {
          if (components[key].partials && components[key].partials[p1]) {
            return components[key].partials[p1];
          }

          return '';
        });

      components[key].template = template;
    }
  });

  return components;
};

export default createComponentTemplates;
