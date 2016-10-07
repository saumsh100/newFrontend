
// const WebpackDevServer = require('webpack-dev-server');
const Webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const express = require('express');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const globals = require('../globals');
const _ = require('lodash');
const argv = require('yargs')
  .alias('s', 'sourceMaps')
  .argv;

const parametricConfig = {
  devtool: argv.sourceMaps ? 'source-map' : webpackConfig.devtool,
};

const finalWebpackConfig = _.assign(webpackConfig, parametricConfig);

module.exports = (port) => {
  // First we fire up Webpack an pass in the configuration we
  // created
  let bundleStart = null;
  let hasBundled = false;
  const compiler = Webpack(finalWebpackConfig);

  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', () => {
    if (hasBundled) console.log('Bundling...');
    bundleStart = Date.now();
  });

  // We also give notice when it is done compiling, including the
  // time it took. Nice to have
  compiler.plugin('done', () => {
    console.log(`Bundled in ${Date.now() - bundleStart}ms!`);
  });

  const bundler = express();

  bundler.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `http://localhost:${globals.port}`);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    return next();
  });

  bundler.use(webpackMiddleware(compiler, {
    publicPath: finalWebpackConfig.output.publicPath,
    historyApiFallback: true,
    quiet: false,
    noInfo: true,
    stats: {
      color: true,
    },
  }));

  bundler.use(webpackHotMiddleware(compiler, {
    log: console.log,
  }));

  // We fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  bundler.listen(port, 'localhost', () => {
    hasBundled = true;
    console.log('Bundling project dynamically, please wait...');
  });
};
