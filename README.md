# Quench Vue

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]

**Simple, client-side hydration of pre-rendered Vue.js apps**

Quench Vue allows server-rendered/static markup to be used as the `data` and `template` for a Vue.js app. It's great for when you can't/don't want to use "real" [server-side rendering](https://vuejs.org/v2/guide/ssr.html).

All of Vue's existing features will work as normal when the app is intialised in the browser.

## Demo

A complete demo is available here: https://codepen.io/stowball/pen/awwGBB

## Installation

### npm

```sh
npm install quench-vue --save
```

### Direct <script> include

```html
<script src="https://unpkg.com/quench-vue/umd/quench-vue.min.js"></script>
```

*Note: You will need to use [the full build of Vue.js](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds), which includes the compiler.*

## Usage

There are 2 ways of defining and using `data` for the app:

1. With a stringified JSON object in the app container's `data-q-data` attribute; and/or
2. With an inline `data-q-binding` attribute on an element, when `data-q-convert-bindings="true"` is added to the app container.

Both techniques can be used together or on their own, but the `data-q-data` is preferred as it's faster, simpler and more versatile.

Let's look at some examples:

### Method 1: Defining the `data` with `[data-q-data]`

This method allows you to easily specify the `data` for the app, including arrays and objects.

```html
<div id="app" data-q-data='
  "title": "Hello, world!",
  "year": 2017,
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
'>
…
</div>
```

#### Rendering the data with `[data-q-binding]`

We obviously duplicate the "data" in the markup, and inform Vue which elements are bound to which `data` properties using a `data-q-binding` attribute whose value points to a property name, such as:

```html
<h1 data-q-binding="title">Hello, World!</h1>
<p data-q-binding="year">2007</p>

<ul>
  <li v-for="tag in tags">
    <span data-q-binding="tag">js</span>
  </li>
  <!-- <v> -->
  <li>
    <span>library</span>
  </li>
  <!-- </v> -->
</ul>

<ul>
  <li v-for="key in author">
    <span data-q-binding="key">Matt</span>
  </li>
  <!-- <v> -->
  <li>
    <span>Stow</span>
  </li>
  <!-- </v> -->
</ul>

<ul>
  <li v-for="skill in skills">
    <span data-q-binding="skill.name">JS</span>
    <span data-q-binding="skill.level">4</span>
  </li>
  <!-- <v> -->
  <li>
    <span>CSS</span>
    <span>5</span>
  </li>
  <!-- </v> -->
</ul>
```

For iterating over lists, we also need to use another syntax, `<!-- <v> --> … <!-- </v> -->`, which [we'll describe later](#hiding-elements-from-the-compiler).

*Note: You only need to output the `v-for` and the `data-q-binding` attributes on the first iteration of the loop.*

### Method 2: Defining the `data` with inline `[data-q-binding]` bindings

When `data-q-convert-bindings="true"` is set on the app's container, we can also use the `[data-q-binding]` attribute to create a `data` variable that is equal to the value of the element's `.textContent`.

*Note:*
* *Bindings specified in the global `data-q-data` object take precedence over inline bindings.*
* *Do not nest elements inside a `data-q-binding` element, or you'll have unexpected results.*

The following examples all perfectly re-create the global `data-q-data` object from before.

#### Simple bindings

```html
<div id="app" data-q-convert-bindings="true">
  <h1 data-q-binding="title">Hello, World!</h1>
  <p data-q-binding="year">2007</p>
</div>
```

#### Array and Object bindings

Vue supports iterating over arrays and objects via [the `v-for` directive](https://vuejs.org/v2/guide/list.html) with the syntax `item in items`, where `items` is the source data list and `item` is an **alias** for the array element being iterated on.

To inline bind with Quench, we need to use another special syntax `itemsSource as item`.

##### Array

To replicate the `tags` array from above, we would:

```html
<div id="app" data-q-convert-bindings="true">
  <li v-for="tag in tags">
    <span data-q-binding="tags[0] as tag">js</span>
  </li>
  <!-- <v> -->
  <li>
    <span data-q-binding="tags[1] as tag">library</span>
  </li>
  <!-- </v> -->
</div>
```

where `itemsSource` is the name of the array (`tags`) plus the index in the array `[0]`/`[1]` which we wish to populate, and `tag` is the `item` alias in the `v-for`.

##### Object

To replicate the `author` object from above, we would:

```html
<div id="app" data-q-convert-bindings="true">
  <li v-for="key in author">
    <span data-q-binding="author.firstName as key">Matt</span>
  </li>
  <!-- <v> -->
  <li>
    <span data-q-binding="author.lastName as key">Stow</span>
  </li>
  <!-- </v> -->
</div>
```

where `itemsSource` is the name of the object (`author`) plus the relevant object key `.firstName`/`.lastName` which we wish to populate, and `key` is the `item` alias in the `v-for`.

##### Array of Objects

Both of the above techniques can be combined, so to replicate the `skills` array from above, we would:

```html
<div id="app" data-q-convert-bindings="true">
  <li v-for="skill in skills">
    <span data-q-binding="skills[0].name as skill.name">JS</span>
    <span data-q-binding="skills[0].level as skill.level">4</span>
  </li>
  <!-- <v> -->
  <li>
    <span data-q-binding="skills[1].name as skill.name">CSS</span>
    <span data-q-binding="skills[1].level as skill.level">5</span>
  </li>
  <!-- </v> -->
</div>
```

where `itemsSource` is the name of the array and index (`skills[0]`) plus the relevant object key `.name`/`.level` which we wish to populate, and `skill.name`/`skill.level` is the `item` alias in the `v-for` plus the object key.

Hopefully you'll agree that using inline bindings to set the `data` is more complicated than using the `data-q-data` method, but it can still have its uses.

*Note: When using inline bindings, arrays and objects are limited to a depth of 1 level.*

### Hiding elements from the compiler

In the previous section, we introduced the `<!-- <v> --> … <!-- </v> -->` syntax. These are a pair of opening and closing comments that exclude the contents within from being passed to the template compiler.

The most obvious use case (and necessary when using inline bindings) is to strip all but the first element of a `v-for` loop as demonstrated earlier.

Another use case is to replace static markup for a component, such as:

```html
<!-- <v> -->
<div>I will be stripped in the app and "replaced" with the component version below</div>
<!-- </v> -->
<my-component text="I'm not visible until parsed through the compiler"></my-component>
```

*Note: Nesting comments is not supported.*

#### Hiding elements in the pre-rendered HTML

To prevent layout jumping and repositioning when the app's template gets compiled, it can be beneficial to visually (and accessibly) hide elements and content that is inappropriate without JavaScript, such as a `<button>`.

By adding a class on your app container and an appropriate CSS rule, this can be achieved easily:

```html
<div id="app" class="pre-rendered">
  <button class="hide-when-pre-rendered" v-on:click="doSomething">I'm a button that only works with JS</button>
</div>
```

```css
.pre-rendered .hide-when-pre-rendered {
  visibility: hidden;
}
```

When Vue compiles our new template, it strips all of the container's attributes from the DOM, thus the class will no longer match.

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

#### For direct <script> include

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/quench-vue"></script>
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

## Benefits

Hopefully you've recognised that you're now able to render fast, SEO-friendly static markup (either from a CMS, static-site generator or component library such as [Fractal](http://fractal.build/)) and have it quickly and easily converted in to a fully dynamic, client-side Vue.js application, without having to set up more complicated server-side rendering processes.

---

Copyright (c) 2017 [Matt Stow](http://mattstow.com)  
Licensed under the MIT license *(see [LICENSE](https://github.com/stowball/quench-vue/blob/master/LICENSE) for details)*


[build-badge]: https://img.shields.io/travis/stowball/quench-vue/master.png?style=flat-square
[build]: https://travis-ci.org/stowball/quench-vue

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/quench-vue
