/* eslint-disable global-require */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');

const paths = require('./helpers/paths');
const { linkFrontEndModule } = require('./helpers/utils');
const commonIsolated = require('./webpack.isolated.common');
const common = require('./webpack.common');

process.env.BABEL_ENV = process.env.NODE_ENV;

const { resolveApp } = paths;
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const shouldNotUseLocalBackend = process.env.USE_LOCAL_BACKEND === 'false';

const pluginsForDevOrProd = () => {
  if (isEnvDevelopment) {
    const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
    return [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true,
      }),
      new BrowserSyncPlugin(
        {
          // browse to http://localhost:3000/ during development
          host: 'localhost',
          port: 3000,
          proxy: `http://localhost:${process.env.WP_PROXY_PORT || '5100'}/`,
        },
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false,
        },
      ),
    ]
  }
  return [];
}

const getHTMLWebpackPluginConfig = !isEnvProduction
  ? {
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  }
  : {};

const optimization = isolated => ((isolated || shouldNotUseLocalBackend) ? {
  // Keep the runtime chunk separated to enable long term caching
  runtimeChunk: {
    name: entrypoint => `runtime-${entrypoint.name}`,
  },
} : {});

const webpackConfig = (isolated = false) => merge(isolated ? commonIsolated : common, {
  entry: paths.entries,
  optimization: {
    ...optimization(isolated),
  },
  plugins: [
    (isolated || shouldNotUseLocalBackend) && new HtmlWebpackPlugin({
      inject: true,
      chunks: ['app'],
      filename: 'index.html',
      template: resolveApp('public/index.html'),
      title: 'Dashboard | CareCru',
      ...getHTMLWebpackPluginConfig,
    }),
    isolated && new HtmlWebpackPlugin({
      inject: true,
      template: resolveApp('public/onlinebooking.html'),
      chunks: ['my'],
      filename: 'my/index.html',
      title: 'Online Booking | CareCru',
      ...getHTMLWebpackPluginConfig,
    }),
    isolated && new HtmlWebpackPlugin({
      inject: true,
      chunks: ['reviews'],
      template: resolveApp('public/index.html'),
      filename: 'reviews/index.html',
      title: 'Reviews | CareCru',
      ...getHTMLWebpackPluginConfig,
    }),
    isolated && new CopyPlugin([
      {
        from: 'public',
        ignore: ['**/*.html'],
      },
    ]),
    isolated && new CopyPlugin([
      {
        from: 'assets',
        to: 'assets',
      },
    ]),
    ...pluginsForDevOrProd(),
  ].filter(Boolean),
});

module.exports = (env) => {
  const isolated = (env && env.isolated) ? env.isolated : false;
  const webpackConfigGenerated = webpackConfig(isolated);
  if (isEnvDevelopment) {
    if (!shouldNotUseLocalBackend) {
      linkFrontEndModule();
    }
    return {
      ...webpackConfigGenerated,
      devServer: require('./shared/dev-server.config'),
    };
  }
  return webpackConfigGenerated;
}
