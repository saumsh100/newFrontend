'use strict';

const path = require('path');
const paths = require('./helpers/paths');
const rules = require('./helpers/moduleLoaders');
const webpackSharedConfig = require('./shared/common');

process.env.BABEL_ENV = process.env.NODE_ENV;

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';


const webpackConfig = {
  ...webpackSharedConfig,
  output: {
    path: isEnvProduction ? paths.appDist : undefined,
    pathinfo: isEnvDevelopment,
    filename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].js'
      : isEnvDevelopment && 'static/js/bundle.js',
    futureEmitAssets: true,
    chunkFilename: isEnvProduction
      ? 'static/js/[name].[contenthash:8].chunk.js'
      : isEnvDevelopment && 'static/js/[name].chunk.js',
    publicPath: paths.publicUrlOrPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: isEnvProduction
      ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
      : isEnvDevelopment && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    // Prevents conflicts when multiple webpack runtimes (from different apps)
    // are used on the same page.
    jsonpFunction: `webpackJsonp${paths.appPackageJson.name}`,
    globalObject: 'this',
  },
  module: {
    strictExportPresence: true,
    rules: rules(true),
  },
};

module.exports = webpackConfig;
