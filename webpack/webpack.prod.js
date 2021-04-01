'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const merge = require('webpack-merge');
const webpackConfigCCP = require('./webpack.config.ccp');

module.exports = (env) =>
  merge(webpackConfigCCP(env), {
    mode: 'production',
  });
