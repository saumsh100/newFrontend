'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

process.env.NODE_ENV = 'production';

const fs = require('fs');
const { mergeWithCustomize, customizeObject } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const common = require('./shared/webpack.common');
const paths = require('./helpers/paths');

const externalModules = (nodeModulesPath) =>
  fs
    .readdirSync(nodeModulesPath)
    .filter((f) => ['.bin'].indexOf(f) === -1)
    .reduce((map, mod) => Object.assign(map, {[mod]: `commonjs ${mod}`}), {});

const webpackConfig = mergeWithCustomize({
  customizeObject: customizeObject({
    entry: 'replace',
  })
})(common, {
  name: 'server',
  target: 'node',
  devtool: 'cheap-module-source-map',
  mode: 'production',
  entry: paths.server,
  output: {
    path: paths.serverDist,
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2',
    globalObject: 'this',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.BUNDLED': true,
    }),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
  ],
  resolve: {
    fallback: {
      console: false,
      global: false,
      process: false,
      __filename: false,
      __dirname: false,
    },

  },
  optimization: {
    splitChunks: false,
    runtimeChunk: false,
    minimize: false,
  },
  watchOptions: {ignored: /node_modules/},
  externals: {
    ...externalModules(path.resolve(paths.appDirectory, 'node_modules')),
  },
});

module.exports = webpackConfig;
