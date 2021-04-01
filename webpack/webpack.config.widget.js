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
const common = require('./shared/webpack.common');
const paths = require('./helpers/paths');

const mergeWebpack = merge.strategy({ entry: 'replace' });
const webpackConfig = (env) => {
  const isolated = (env && env.isolated) ? env.isolated : false;

  return mergeWebpack(common(isolated), {
  mode: 'production',
  entry: paths.cc,
  devtool: 'hidden-source-map',
  output: {
    path: isolated ? paths.appDist : paths.appBuildWidget,
    publicPath: paths.publicUrlOrPath,
    filename: isolated
      ? 'widget/[name].[contenthash:8].js'
      : '[name].[hash].js',
    chunkFilename: isolated
      ? 'widget/[name].[contenthash:8].chunk.js'
      : '[name].[hash].chunk.js',
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['widget', 'widget/*'],
    }),
  ],
  optimization: {
    splitChunks: false,
    runtimeChunk: false,
  },
});
}

module.exports = webpackConfig;
