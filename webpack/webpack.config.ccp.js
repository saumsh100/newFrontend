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
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const { ModuleFederationPlugin } = require('webpack').container;

const paths = require('./helpers/paths');
const common = require('./shared/webpack.common');

process.env.BABEL_ENV = process.env.NODE_ENV;

const { resolveApp } = paths;
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

const pluginsForDevOrProd = () => {
  if (isEnvDevelopment) {
    return [new webpack.HotModuleReplacementPlugin()];
  }
  return [];
};

const sharedDeps = ['react', 'react-dom', '@carecru/component-library'];

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

const webpackConfig = merge(common, {
  entry: paths.entries,
  plugins: [
    new ModuleFederationPlugin({
      name: 'CCP_Frontend',
      filename: 'remoteEntry.js',
      remotes: {
        EM_MFE: `EM_MFE@${process.env.ENTERPRISE_MANAGEMENT_HOST}/remoteEntry.js`,
      },
      exposes: {
        './factory': './client/store/factory.js',
      },
      shared: sharedDeps.reduce((acc, dep) => {
        return {
          ...acc,
          [dep]: { singleton: true, eager: true },
        };
      }, {}),
    }),
    new ModuleFederationPlugin({
      name: 'WaitlistContainer',
      remotes: {
        WAITLIST_MFE: `WAITLIST_MFE@${process.env.WAITLIST_MFE_HOST}/waitlistRemoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          eager: true,
        },
        '@carecru/component-library': {
          singleton: true,
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['app'],
      filename: 'index.html',
      template: resolveApp('public/index.html'),
      title: 'Dashboard | CareCru',
      ...getHTMLWebpackPluginConfig,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: resolveApp('public/onlinebooking.html'),
      chunks: ['my'],
      filename: 'my/index.html',
      title: 'Online Booking | CareCru',
      ...getHTMLWebpackPluginConfig,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['reviews'],
      template: resolveApp('public/index.html'),
      filename: 'reviews/index.html',
      title: 'Reviews | CareCru',
      ...getHTMLWebpackPluginConfig,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/*.html'],
          },
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
        },
      ],
    }),
    ...pluginsForDevOrProd(),
  ],
});

module.exports = () => {
  if (isEnvDevelopment) {
    return merge(webpackConfig, {
      devServer: require('./shared/dev-server.config'),
    });
  }
  return webpackConfig;
};
