
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const developmentConfig = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ exclude: /node_modules/ })],
    splitChunks: {
      chunks: 'all',
      name: 'common',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
          priority: 20,
        },
      },
    },
  },
});

module.exports = () => developmentConfig;
