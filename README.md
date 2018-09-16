<p align="center">
  <img src="https://i.imgur.com/CbwlGnn.png" height="200" alt="Quench Vue logo" />
  <div align="center">
    <a href="https://travis-ci.org/stowball/quench-vue">
      <img src="https://img.shields.io/travis/stowball/quench-vue/master.png?style=flat-square" alt="Travis build status" />
    </a>
    <a href="https://www.npmjs.org/package/quench-vue">
      <img src="https://img.shields.io/npm/v/quench-vue.png?style=flat-square" alt="npm package" />
    </a>
  </div>
</p>

# Quench Vue

**Simple, tiny, client-side hydration of pre-rendered [Vue.js](https://vuejs.org) apps**

Quench Vue allows server-rendered/static markup to be used as a Vue app's `data`, `template` and local components' `template`s. It's great for when you can't/don't want to use "real" [server-side rendering](https://vuejs.org/v2/guide/ssr.html).

All of Vue's existing features will work as normal when the app is initialised in the browser.

## Table of Contents

- [Demo](#demo)
- [Installation](#installation)
  - [npm](#npm)
  - [Direct `<script>` include](#direct-script-include)
- [Usage](#usage)
- [Defining the app `data` and `template`](#defining-the-app-data-and-template)
  - [Method 1: Defining the `data` with `[q-data]`](#method-1-defining-the-data-with-q-data)
    - [Rendering the data with `[v-text]` or `[q-binding]`](#rendering-the-data-with-v-text-or-q-binding)
  - [Method 2: Defining the `data` with inline `[q-binding]` bindings](#method-2-defining-the-data-with-inline-q-binding-bindings)
    - [Simple bindings](#simple-bindings)
    - [Array and Object bindings](#array-and-object-bindings)
      - [Array](#array)
      - [Object](#object)
      - [Array of Objects](#array-of-objects)
    - [Non-element bindings](#non-element-bindings)
  - [Referencing global variables as `data` properties](#referencing-global-variables-as-data-properties)
  - [Excluding elements from the app template compiler](#excluding-elements-from-the-app-template-compiler)
  - [Instantiating the app](#instantiating-the-app)
    - [With a module bundler, such as webpack](#with-a-module-bundler-such-as-webpack)
    - [For direct `<script>` include](#for-direct-script-include)
- [Defining local component `template`s](#defining-local-component-templates)
  - [Specifying a component with `[q-component]`](#specifying-a-component-with-q-component)
  - [Specifying a component's `template`](#specifying-a-components-template)
  - [Handling a `template`'s logic](#handling-a-templates-logic)
    - [Method 1: Add the logic within the markup](#method-1-add-the-logic-within-the-markup)
    - [Method 2: Add the logic to the component's JavaScript using `partials`](#method-2-add-the-logic-to-the-components-javascript-using-partials)
    - [Define a completely different component](#define-a-completely-different-component)
  - [Excluding elements from the component template compiler](#excluding-elements-from-the-component-template-compiler)
  - [Rendering future components dynamically](#rendering-future-components-dynamically)
  - [Updating our app initialization to support pre-rendered components](#updating-our-app-initialization-to-support-pre-rendered-components)
    - [With a module bundler, such as webpack](#with-a-module-bundler-such-as-webpack-1)
    - [For direct `<script>` include](#for-direct-script-include-1)
- [Hiding elements in the pre-rendered HTML](#hiding-elements-in-the-pre-rendered-html)
- [Embedding additional app templates](#embedding-additional-app-templates)
- [Benefits](#benefits)

## Demo

A complete demo is available here: https://codepen.io/stowball/pen/awwGBB

## Installation

### npm

```sh
npm install quench-vue --save
```

### Direct `<script>` include

```html
<script src="https://unpkg.com/quench-vue/umd/quench-vue.min.js"></script>
```

*Note: You will need to use [the full build of Vue.js](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds), which includes the compiler.*

## Usage

1. [Defining the app `data` and `template`](#defining-the-app-data-and-template).
2. [Defining local component `template`s](#defining-local-component-templates).

## Defining the app `data` and `template`

There are 2 ways of defining and using `data` for the app:

1. With a stringified JSON object in the app container's `q-data` attribute; and/or
2. With an inline `q-binding` attribute on an element, when `q-convert-bindings` is added to the app container.

Both techniques can be used together or on their own, but the `q-data` is preferred as it's faster, simpler and more versatile.

Let's look at some examples:

### Method 1: Defining the `data` with `[q-data]`

This method allows you to easily specify the `data` for the app, including arrays and objects.

```html
<div id="app" q-data='{
  "title": "Hello, world!",
  "year": 2018,
  "tags": [
    "js",
    "library"
  ],
  "author": {
    "firstName": "Matt",
    "lastName": "Stow"
  },
  "skills": [
    {
      "name": "JS",
      "level": 4
    },
    {
      "name": "CSS",
      "level": 5
    }
  ]
}'>
…
</div>
```

#### Rendering the data with `[v-text]` or `[q-binding]`

We obviously duplicate the "data" in the markup, and inform Vue which elements are bound to which `data` properties using a [`v-text`](https://vuejs.org/v2/api/#v-text) or `q-binding` attribute whose value points to a property name, such as:

```html
<h1 v-text="title">Hello, World!</h1>
<p v-text="year">2018</p>

<ul>
  <li v-for="tag in tags">
    <span v-text="tag">js</span>
  </li>
  <!-- <q> -->
  <li>
    <span>library</span>
  </li>
  <!-- </q> -->
</ul>

<ul>
  <li v-for="key in author">
    <span v-text="key">Matt</span>
  </li>
  <!-- <q> -->
  <li>
    <span>Stow</span>
  </li>
  <!-- </q> -->
</ul>

<ul>
  <li v-for="skill in skills">
    <span v-text="skill.name">JS</span>
    <span v-text="skill.level">4</span>
  </li>
  <!-- <q> -->
  <li>
    <span>CSS</span>
    <span>5</span>
  </li>
  <!-- </q> -->
</ul>
```

For iterating over lists, we also need to use another syntax, `<!-- <q> --> … <!-- </q> -->`, which [we'll describe later](#hiding-elements-from-the-compiler).

*Note:*
* *You can also use [`v-html`](https://vuejs.org/v2/api/#v-html) to render HTML, but ensure that it's sanitized and trusted.*
* *You only need to output the `v-for` and the `v-text`/`q-binding` attributes on the first iteration of the loop.*

### Method 2: Defining the `data` with inline `[q-binding]` bindings

While we don't recommend the following approach for anything but the simplest of apps, when `q-convert-bindings` is set on the app's container, we can also use the `q-binding` attribute to create a `data` variable that is equal to the value of the element's `.textContent`.

*Note:*
* *Bindings specified in the global `q-data` object take precedence over inline bindings.*
* *Do not nest elements inside a `q-binding` element, or you'll have unexpected results.*

The following examples all perfectly re-create the global `q-data` object from before.

#### Simple bindings

```html
<div id="app" q-convert-bindings>
  <h1 q-binding="title">Hello, World!</h1>
  <p q-binding="year">2018</p>
</div>
```

#### Array and Object bindings

Vue supports iterating over arrays and objects via [the `v-for` directive](https://vuejs.org/v2/guide/list.html) with the syntax `item in items`, where `items` is the source data list and `item` is an **alias** for the array element being iterated on.

To inline bind with Quench, we need to use another special syntax `itemsSource as item`.

##### Array

To replicate the `tags` array from above, we would:

```html
<div id="app" q-convert-bindings>
  <ul>
    <li v-for="tag in tags">
      <span q-binding="tags[0] as tag">js</span>
    </li>
    <!-- <q> -->
    <li>
      <span q-binding="tags[1] as tag">library</span>
    </li>
    <!-- </q> -->
  </ul>
</div>
```

where `itemsSource` is the name of the array (`tags`) plus the index in the array `[0]`/`[1]` which we wish to populate, and `tag` is the `item` alias in the `v-for`.

##### Object

To replicate the `author` object from above, we would:

```html
<div id="app" q-convert-bindings>
  <ul>
    <li v-for="key in author">
      <span q-binding="author.firstName as key">Matt</span>
    </li>
    <!-- <q> -->
    <li>
      <span q-binding="author.lastName as key">Stow</span>
    </li>
    <!-- </q> -->
  </ul>
</div>
```

where `itemsSource` is the name of the object (`author`) plus the relevant object key `.firstName`/`.lastName` which we wish to populate, and `key` is the `item` alias in the `v-for`.

##### Array of Objects

Both of the above techniques can be combined, so to replicate the `skills` array from above, we would:

```html
<div id="app" q-convert-bindings>
  <ul>
    <li v-for="skill in skills">
      <span q-binding="skills[0].name as skill.name">JS</span>
      <span q-binding="skills[0].level as skill.level">4</span>
    </li>
    <!-- <q> -->
    <li>
      <span q-binding="skills[1].name as skill.name">CSS</span>
      <span q-binding="skills[1].level as skill.level">5</span>
    </li>
    <!-- </q> -->
  </ul>
</div>
```

where `itemsSource` is the name of the array and index (`skills[0]`) plus the relevant object key `.name`/`.level` which we wish to populate, and `skill.name`/`skill.level` is the `item` alias in the `v-for` plus the object key.

Hopefully you'll agree that using inline bindings to set the `data` is more complicated than using the `q-data` method, but it can still have its uses.

*Note: When using inline bindings, arrays and objects are limited to a depth of 1 level.*

#### Non-element bindings

Since v0.7.0, you can also create `data` from bindings using specially formatted comments, thus not requiring to have actual elements to attach to. This can be useful if you need to create extra `data` that is "invisible" to the user, or if you need to create more complex values, such as nested arrays and objects.

Using the syntax `<!-- q-binding:[dataPropertyName] = [value] -->` we can easily recreate the `data` from the previous examples:

```html
<div id="app" q-convert-bindings>
  <!-- q-binding:title = "Hello, World!" -->
  <!-- q-binding:year = 2018 -->
  <!-- q-binding:tags[0] = "js" -->
  <!-- q-binding:tags[1] = "library" -->
  <!-- q-binding:author.firstName = "Matt" -->
  <!-- q-binding:author.lastName = "Stow" -->
  <!-- q-binding:skills[0].name = "JS" -->
  <!-- q-binding:skills[0].level = 4 -->
  <!-- q-binding:skills[1].name = "CSS" -->
  <!-- q-binding:skills[1].level = 5 -->
</div>
```

However, we can also create more complex `data` values. The following recreates the above arrays and objects succinctly.

```html
<div id="app" q-convert-bindings>
  <!-- q-binding:tags = ["js", "library"] -->
  <!-- q-binding:author = { "firstName": "Matt", "lastName": "Stow" } -->
  <!-- q-binding:skills = [{ "name": "JS", "level": 4 }, { "name": "CSS", "level": 5 }] -->
</div>
```

*Note: Non-element bindings must be JSON-serializable and written on one line.*

### Referencing global variables as `data` properties

You can also pass global variables (on `window`) to be used as data properties. Similarly to `q-data`, we can pass a stringified JSON object of key/value pairs to a `q-r-data` attribute, where *key* is the name of the `data`'s property and *value* the name of the global variable to be used, which can also use dot notation to access properties of an object.

```html
<script>
  var ENV = 'dev';
  var PORT = 3000;
  var obj = {
    foo: 'bar',
    baz: 'qux',
  }
</script>
<div id="app" q-r-data='{
  "env": "ENV",
  "port": "PORT",
  "foo": "obj.foo",
  "baz": "obj.baz"
}'></div>
```

which will produce the following `data`:

```js
{
  env: 'dev',
  port: 3000,
  foo: 'bar',
  baz: 'qux',
}
```

*Note: Bindings specified in the `q-r-data` object take precedence over those in `q-data`.*

### Excluding elements from the app template compiler

In the previous sections, we introduced the `<!-- <q> --> … <!-- </q> -->` syntax. These are a pair of opening and closing comments that exclude the contents within from being passed to the template compiler.

The most obvious use case (and necessary when using inline bindings) is to strip all but the first element of a `v-for` loop as demonstrated earlier.

Another use case is to replace static markup for a component, such as:

```html
<!-- <q> -->
<div>I will be stripped in the app and "replaced" with the component version below</div>
<!-- </q> -->
<my-component text="I'm not visible until parsed through the compiler"></my-component>
```

*Note: Nesting comments is not supported.*

### Instantiating the app

Very little needs to change from the way you'd normally instantiate an app.

#### With a module bundler, such as webpack

```js
import Vue from 'vue';
import { createAppData, createAppTemplate } from 'quench-vue';

var appEl = document.getElementById('app');
var data = createAppData(appEl);
var template = createAppTemplate(appEl);

var app = new Vue({
  el: appEl,
  data: data,
  template: template,
});
```

#### For direct `<script>` include

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/quench-vue/umd/quench-vue.min.js"></script>
```

```js
var appEl = document.getElementById('app');
var data = quenchVue.createAppData(appEl);
var template = quenchVue.createAppTemplate(appEl);

var app = new Vue({
  el: appEl,
  data: data,
  template: template,
});
```

## Defining local component `template`s

Vue applications are often comprised of multiple components, which promotes reuse and reduces repetition. However, the more components you have, the greater your JavaScript bundle will be. While complex components, such as interactive UI widgets should probably be defined in JavaScript, simpler, more display-only components can easily be defined from existing, pre-rendered HTML with Quench Vue.

Defining local component `template`s from existing markup suits situations such as an infinite scroll of news cards, where the original "page" of cards are pre-rendered, and as a user scrolls, your Vue app needs to fetch and append more cards from a JSON API response.

*Note: You cannot use Quench Vue to specify the `template` of global components created with `Vue.component()`. We consider global components an anti-pattern anyway.*

### Specifying a component with `[q-component]`

Any element within your app's `el` can be used as the markup for a component by adding an attribute of `q-component="NAME"`, where `"NAME"` is the name of the local component defined in your Vue app.

Typically, this would be on a `<div>` or similar, which sets the `outerHTML` of the element to be used as the `template`. However, you can also use a `<template>` element as the component definition, in which case the `innerHTML` becomes the `template`.

For instance:

```html
<div q-component="card">
  <h3>Card</h3>
</div>
```

will create a `template` of:

```html
<div>
  <h3>Card</h3>
</div>
```

but:

```html
<!-- <q> -->
<template q-component="card">
  <h3>Card</h3>
</template>
<!-- </q> -->
```

will create a `template` of:

```html
<h3>Card</h3>
```

*Note:*
* *Only the first instance of `q-component="NAME"` will be used as the component's `template`, so it's safe to output multiple instances when iterating over an array on the back-end.*
* *Components defined with `<template>` need to be wrapped in `<!-- <q> --> … <!-- </q> -->` comments to prevent them from being included in the app's template.*
* *We opted for a custom, `q-component` syntax (compared with Vue's native [`inline-template`](https://vuejs.org/v2/guide/components.html#Inline-Templates) syntax) for various reasons, but mainly because it allows for greater flexibility in the types of templates that can be defined (such as `<tr>`s with multiple children), and we can supplement with additional features as described below.*

### Specifying a component's `template`

The previous templates aren't particularly useful, but as you'd expect, any Vue directives or template syntax can be used and will be converted, similar to the app's template above (with the exception of not supporting Quench Vue's `q-binding`).

Take the following HTML:

```html
<div
  class="card"
  q-component="card"
  v-bind:class="{ 'card--feature': props.isFeatured }"
>
  <a
    href="/news/nintendo-arcade"
    v-bind:href="props.href"
  >
    <h3 v-text="props.title">
      Mario Bros And Other Nintendo Arcade Games Coming To Nintendo Switch
    </h3>
    <p v-text="props.date">
      September 13, 2017
    </p>
  </a>
</div>

<div
  class="card"
  q-component="card"
  v-bind:class="{ 'card--feature': props.isFeatured }"
>
  <a
    href="/news/doom-2016"
    v-bind:href="props.href"
  >
    <h3 v-text="props.title">
      Doom 2016 Is Coming To Nintendo Switch
    </h3>
    <p v-text="props.date">
      September 12, 2017
    </p>
  </a>
</div>
```

which will define the `card` component's `template` as:

```html
<div
  class="card"
  v-bind:class="{ 'card--feature': props.isFeatured }"
>
  <a v-bind:href="props.href">
    <h3 v-text="props.title"></h3>
    <p v-text="props.date"></p>
  </a>
</div>
```

### Handling a `template`'s logic

While the previous template will handle content and style differences, it's not uncommon for a component's markup to also change based on certain conditions. There a 3 ways in which we can handle these logic requirements:

1. Add the logic within the markup (often using `<template>` so they're invisible in the pre-rendered markup).
2. Add the logic within the component's JavaScript using a proprietary `partials` object and reference it with a special `<q-component-partial name="NAME"></q-component-partial>` syntax; or
3. Define a completely different component.

Let's look at some examples:

#### Method 1: Add the logic within the markup

```html
<div
  class="card"
  q-component="card"
  v-bind:class="{ 'card--feature': props.isFeatured }"
>
  <a
    href="/news/nintendo-arcade"
    v-bind:href="props.href"
  >
    <!-- <q-component> -->
    <img src="/nintendo-arcade.jpg" alt="Screenshot of Nintendo arcade games" />
    <!-- </q-component> -->
    <template v-if="props.image">
      <img
        v-bind:src="props.image"
        v-bind:alt="props.alt"
      />
    </template>
    <template v-else>
      <div class="fallback"></div>
    </template>
    <h3 v-text="props.title">
      Mario Bros And Other Nintendo Arcade Games Coming To Nintendo Switch
    </h3>
    <p v-text="props.date">
      September 13, 2017
    </p>
  </a>
</div>
```

This will most likely be the primary method used to handle template logic, however, with complex conditions, you may like to consider the following 2 approaches.

#### Method 2: Add the logic to the component's JavaScript using `partials`

When defining the component in JavaScript, add a `partials` object with a name and template string key/value pair, like so:

```js
components: {
  card: {
    partials: {
      image: `
        <template v-if="props.image">
          <img
            v-bind:src="props.image"
            v-bind:alt="props.alt"
          />
        </template>
        <template v-else>
          <div class="fallback"></div>
        </template>
      ` // Using ES6 template literals, but any string concatenation method works
    },
    template: 'local'
  }
}
```

and reference it in the pre-rendered component with `<q-component-partial name="image"></q-component-partial>`:

```html
<div
  class="card"
  q-component="card"
  v-bind:class="{ 'card--feature': props.isFeatured }"
>
  <a
    href="/news/nintendo-arcade"
    v-bind:href="props.href"
  >
    <!-- <q-component> -->
    <img src="/nintendo-arcade.jpg" alt="Screenshot of Nintendo arcade games" />
    <!-- </q-component> -->
    <q-component-partial name="image"></q-component-partial>
    <h3 v-text="props.title">
      Mario Bros And Other Nintendo Arcade Games Coming To Nintendo Switch
    </h3>
    <p v-text="props.date">
      September 13, 2017
    </p>
  </a>
</div>
```

When the template is compiled, this `<q-component-partial name="image">` will be converted to the value of the app's `components.partials.image` property.

This method allows you to move more complex or repetitive logic into the JavaScript to reduce the size of the pre-rendered HTML.

*Note: Having a `<q-component-partial>` element within your markup could affect your layout. There are 2 solutions to this problem:*
1. *Add `q-component-partial { display: none; }` to your CSS; or*
2. *Wrap HTML comments around the tag `<!-- <q-component-partial></q-component-partial> -->`, which reduces the need for extra CSS, but may make the HTML less obvious in your editor.*

#### Define a completely different component

Instead of handling the logic in the front-end, you could define separate component variations in the pre-rendered HTML. The downside to this approach is, that if your original markup didn't contain a component variation which was later used, Vue would throw an error. A workaround to this is to output a `<template q-component="NAME">` as a fallback for all possible variations that weren't in the original data.

Here we define 2 components, `card--default` and `card--fallback`, and remove all the `v-if` logic from the markup.

```html
<div
  class="card"
  q-component="card--default"
  v-bind:class="{ 'card--feature': props.isFeatured }"
>
  <a
    href="/news/nintendo-arcade"
    v-bind:href="props.href"
  >
    <img
      src="/nintendo-arcade.jpg"
      alt="Screenshot of Nintendo arcade games"
      v-bind:src="props.image"
      v-bind:alt="props.alt"
    />
    <h3 v-text="props.title">
      Mario Bros And Other Nintendo Arcade Games Coming To Nintendo Switch
    </h3>
    <p v-text="props.date">
      September 13, 2017
    </p>
  </a>
</div>

<template q-component="card--fallback">
  <div
    class="card"
    v-bind:class="{ 'card--feature': props.isFeatured }"
  >
    <a
      href="/news/doom-2016"
      v-bind:href="props.href"
    >
      <div class="fallback"></div>
      <h3 v-text="props.title">
        Doom 2016 Is Coming To Nintendo Switch
      </h3>
      <p v-text="props.date">
        September 12, 2017
      </p>
    </a>
  </div>
</template>
```

### Excluding elements from the component template compiler

Similarly to [excluding elements from the app template compiler](#excluding-elements-from-the-app-template-compiler), elements within a component can be excluded from its template by being wrapped in a pair of `<!-- <q-component> --> … <!-- </q-component> -->` comments as demonstrated in the earlier examples.

### Rendering future components dynamically

While components are normally rendered with their name in angled brackets (`<navigation></navigation>`), Vue also [supports a meta component (`<component></component>`)](https://vuejs.org/v2/api/#component) which allows us to programmatically render a component of our choice.

Assuming we had 4 card variations: `card--default`, `card--fallback`, `card--twitter` and `card--instagram`, we can use a unique variable (often a property on the card's `props` object such as `type`) to selectively render future components of that type using the `is` attribute.

Here we iterate over our `cards` array, dynamically render the correct card component based on `card.type` and pass the card's data to the `props` prop.

```html
<li v-for"card in cards">
  <component
    v-bind:is="card.type"
    v-bind:props="card"
  ></component>
</li>
```

```js
[
  {
    type: 'card--twitter',
    title: 'Arguing on the Internet still rampant',
    …
  },
  {
    type: 'card--default',
    title: 'Mario Bros And Other Nintendo Arcade Games Coming To Nintendo Switch',
    …
  },
  {
    type: 'card--instagram',
    title: 'Check out this selfie of me and my avocado',
    …
  },
  {
    type: 'card--fallback',
    title: 'Doom 2016 Is Coming To Nintendo Switch',
    …
  }
]
```

### Updating our app initialization to support pre-rendered components

Very little needs to change [from our earlier example](#instantiating-the-app).

#### With a module bundler, such as webpack

```js
import Vue from 'vue';
import { createAppData, createAppTemplate, createComponentTemplates } from 'quench-vue'; // import createComponentTemplates

var appEl = document.getElementById('app');
var data = createAppData(appEl);
var components = {
  'card--default': { // Register all possible components for this app
    props: ['props'], // Define props as you normally would
    template: 'local', // Specify that the component's template is "local"
  },
  'card--fallback': {
    props: ['props'],
    template: 'local',
  },
  'card--instagram': {
    props: ['props'],
    template: 'local',
  },
  'card--twitter': {
    props: ['props'],
    template: 'local',
  }
};
components = createComponentTemplates(app, components); // Convert and add templates to your components
var template = createAppTemplate(appEl); // createAppTemplate has to be called after createComponentTemplates

var app = new Vue({
  el: appEl,
  components: components,
  data: data,
  template: template,
});
```

*Note: camelCase component names are converted to kebab-case, so you can use [object shorthand notation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions) to define your components after `import`ing them*

#### For direct `<script>` include

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/quench-vue/umd/quench-vue.min.js"></script>
```

```js
var appEl = document.getElementById('app');
var data = quenchVue.createAppData(appEl);
var components = {
  'card--default': { // Register all possible components for this app
    props: ['props'], // Define props as you normally would
    template: 'local', // Specify that the component's template is "local"
  },
  'card--fallback': {
    props: ['props'],
    template: 'local',
  },
  'card--instagram': {
    props: ['props'],
    template: 'local',
  },
  'card--twitter': {
    props: ['props'],
    template: 'local',
  }
};
components = quenchVue.createComponentTemplates(app, components); // Convert and add templates to your components
var template = quenchVue.createAppTemplate(appEl); // createAppTemplate has to be called after createComponentTemplates

var app = new Vue({
  el: appEl,
  components: components,
  data: data,
  template: template,
});
```

## Hiding elements in the pre-rendered HTML

To prevent layout jumping and repositioning when the app's template gets compiled, it can be beneficial to visually (and accessibly) hide elements and content that is inappropriate without JavaScript, such as a `<button>`.

By adding a class on your app container and an appropriate CSS rule, this can be achieved easily:

```html
<div id="app" class="pre-quench">
  <button
    class="hide-when-pre-quench"
    v-on:click="doSomething"
  >
    I'm a button that only works with JS
  </button>
</div>
```

```css
.pre-quench .hide-when-pre-quench {
  visibility: hidden;
}
```

When Quench compiles our template for Vue, it removes any `pre-quench` classes and adds a `quenched` class, thus providing the ability to style elements based on the pre and post-quenched state.

## Embedding additional app templates

You may also like to embed an additional JavaScript string template within the compiled, pre-rendered template. This can easily be achieved by passing the template as the second parameter to `createAppTemplate()`, and describing where it will appear with a `<q-template></q-template>` tag.

A possible use case for this technique is when you need to create multiple apps of simple components (such as a video player), but you don't want to have to continually repeat the `<video-player />` component definition.

```html
<div
  class="video-player"
  q-data='{
    "autoplay": true,
    "id": "someId"
  }'
>
  <q-template></q-template>
</div>
```

```js
var baseTemplate = '<video-player v-bind:autoplay="autoplay" v-bind:id="id"></video-player>';
var template = createAppTemplate(appEl, baseTemplate);
```

*Note: You can also wrap HTML comments around the tag `<!-- <q-template></q-template> -->`, to hide the placeholder from the browser's parser.*

## Benefits

Hopefully you've recognized that you're now able to render fast, SEO-friendly static markup (either from a CMS, static-site generator or component library such as [Fractal](http://fractal.build/)) and have it quickly and easily converted into a fully dynamic, client-side Vue.js application, without having to set up more complicated server-side rendering processes.

---

Copyright (c) 2018 [Matt Stow](http://mattstow.com)  
Licensed under the MIT license *(see [LICENSE](https://github.com/stowball/quench-vue/blob/master/LICENSE) for details)*
