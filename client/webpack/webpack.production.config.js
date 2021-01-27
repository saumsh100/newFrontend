
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

/* eslint-disable camelcase */
const { NODE_ENV, SOURCE } = process.env;
const isEnvProduction = NODE_ENV === 'production';
const shouldUseSourceMap = SOURCE === 'true';
const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');

const developmentConfig = merge(baseConfig, {
  mode: 'production',
  devtool: shouldUseSourceMap ? 'source-map' : 'cheap-module-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /node_modules/,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          keep_classnames: isEnvProductionProfile,
          keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: shouldUseSourceMap,
      }),
    ],
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
