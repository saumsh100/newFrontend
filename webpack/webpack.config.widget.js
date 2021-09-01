'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

process.env.NODE_ENV = 'production';

const { mergeWithCustomize, customizeObject } = require('webpack-merge');
const common = require('./shared/webpack.common');
const paths = require('./helpers/paths');

const webpackConfig = mergeWithCustomize(
  {
    customizeObject: customizeObject({
      entry: 'replace'
    })
  }
)(
  common,
  {
    mode: 'production',
    entry: paths.cc,
    devtool: 'hidden-source-map',
    output: {
      path: paths.appDist,
      publicPath: paths.publicUrlOrPath,
      filename: 'widget/[name].[contenthash:8].js',
      chunkFilename: 'widget/[name].[contenthash:8].chunk.js',
    },
    optimization: {
      splitChunks: false,
      runtimeChunk: false,
    },
  }
)

module.exports = webpackConfig;
