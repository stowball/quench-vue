const createComponentTemplates = (app, components) => {
  if (!app || !components) {
    return;
  }

  Object.keys(components).forEach((key) => {
    const component = components[key];

    if (component.components) {
      component.components = createComponentTemplates(app, component.components);
    }

    if (component.template === 'local') {
      const selector = key.replace(/(.+?)([A-Z])/g, '$1-$2').toLowerCase();
      const componentEl = app.querySelector(`[q-component="${selector}"]`);

      if (componentEl) {
        component.template = (componentEl.tagName === 'TEMPLATE' ? componentEl.innerHTML : componentEl.outerHTML)
          .replace(`q-component="${selector}"`, '')
          .replace(/(\sv-(text|html).*?>)[\s\S]*?<\//g, '$1</')
          .replace(/<!--\s*<q-component>\s*-->[\s\S]*?<!--\s*<\/q-component>\s*-->/g, '')
          .replace(/(?:<!--\s*)?<q-component-partial\s+name=["'](.*?)["']\s*><\/q-component-partial>(\s*-->)?/g, (match, p1) => {
            if (component.partials && component.partials[p1]) {
              return component.partials[p1];
            }

            return '';
          });
      }
    }
  });

  return components;
};

export default createComponentTemplates;
