'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

process.env.NODE_ENV = 'production';

const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.common');
const paths = require('./helpers/paths');

const mergeWebpack = merge.strategy({ entry: 'replace' });
const webpackConfig = mergeWebpack(baseConfig, {
  mode: 'production',
  entry: paths.cc,
  output: {
    path: paths.appBuildWidget,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].chunk.js',
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        'widget',
        'widget/*',
      ],
    }),
  ],
  optimization: {
    splitChunks: false,
  },
});

module.exports = webpackConfig;
