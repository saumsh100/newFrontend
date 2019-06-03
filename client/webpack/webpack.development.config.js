
const webpack = require('webpack');
const merge = require('webpack-merge');
/* eslint-disable import/no-extraneous-dependencies */
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const devServer = require('./dev-server.config');
const { linkFrontEndModule } = require('./utils');

const developmentConfig = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HardSourceWebpackPlugin({
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', '.env'],
      },
    }),

    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: 'http://localhost:5100/',
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false,
      },
    ),
  ],

  optimization: {
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

  devServer,
});

module.exports = () => {
  linkFrontEndModule();
  return developmentConfig;
};
