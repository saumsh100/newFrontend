'use strict';

const path = require('path');

const paths = require('./helpers/paths');
const rules = require('./helpers/moduleLoaders');
const webpackSharedConfig = require('./shared/common');

process.env.BABEL_ENV = process.env.NODE_ENV;

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const shouldNotUseLocalBackend = process.env.USE_LOCAL_BACKEND === 'false';

const webpackConfig = {
  ...webpackSharedConfig,
  output: {
    path: (isEnvProduction || !shouldNotUseLocalBackend) ? paths.appBuild : undefined,
    pathinfo: isEnvDevelopment,
    filename: isEnvProduction
      ? '[name].[contenthash:8].js'
      : '[name].[hash].js',
    futureEmitAssets: true,
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
    rules: rules(),
  },
};

module.exports = webpackConfig;
