const replace = require('replace-in-file');

replace.sync({
  files: './umd/quench-vue.js',
  from: new RegExp('\\["default"\\]'),
  to: '',
});

replace.sync({
  files: './umd/quench-vue.min.js',
  from: new RegExp('(\\)).default(\\})'),
  to: '$1$2',
});
