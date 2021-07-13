/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */

'use strict';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const safePostCssParser = require('postcss-safe-parser');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const rules = require('../helpers/moduleLoaders');

const paths = require('../helpers/paths');
const { getCompleteHost } = require('../helpers/utils');

process.env.BABEL_ENV = process.env.NODE_ENV;

const {
  NODE_ENV,
  DEBUG,
  INTERCOM_APP_ID,
  FEATURE_FLAG_KEY,
  MODE_ANALYTICS_ACCESS_KEY,
  GOOGLE_API_KEY,
  EXECUTION_ENVIRONMENT,
  POLLING_FOLLOWUP_INTERVAL,
  POLLING_SCHEDULE_INTERVAL,
  POLLING_REVENUE_INTERVAL,
  POLLING_VWR_INTERVAL,
  POLLING_UNREAD_CHAT_INTERVAL,
  SOURCE,
  WORKFLOW_HOST,
  FORMS_HOST,
  CHAT_HOST,
  MY_SUBDOMAIN = 'my'
} = process.env;

const isEnvDevelopment = NODE_ENV === 'development';
const isEnvProduction = NODE_ENV === 'production';
const shouldUseSourceMap = SOURCE === 'true';
const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');
const apiHost = getCompleteHost(process.env);

const pluginsForDevOrProd = isEnvDevelopment
  ? [new webpack.NamedModulesPlugin(), new CaseSensitivePathsPlugin()]
  : [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
    ];

const getShouldUseSourceMap = () => (shouldUseSourceMap ? 'source-map' : false);

const webpackConfig = {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? getShouldUseSourceMap()
      : isEnvDevelopment && 'cheap-module-source-map',
    cache: true,
    context: path.normalize(
      path.join(
        __dirname,
        '..',
        '..',
      ),
    ),
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.json'],
      symlinks: false,
      cacheWithContext: false,
      alias: {
        'react-dom': isEnvDevelopment ? '@hot-loader/react-dom' : 'react-dom',
        'react-redux': isEnvDevelopment ? 'react-redux/lib' : 'react-redux',
        ...(isEnvProductionProfile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
      },
    },
    output: {
      path: isEnvProduction ? paths.appDist : undefined,
        publicPath: paths.publicUrlOrPath,
        filename: isEnvProduction
          ? 'static/js/[name].[contenthash:8].js'
          : isEnvDevelopment && 'static/js/bundle.js',
        chunkFilename: isEnvProduction
          ? 'static/js/[name].[contenthash:8].chunk.js'
          : isEnvDevelopment && 'static/js/[name].chunk.js',
      pathinfo: isEnvDevelopment,
      futureEmitAssets: true,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment &&
          ((info) => {
            let pathResource = info.absoluteResourcePath;
            if(!pathResource.includes('node_modules') && pathResource.startsWith('../src')) {
              pathResource = pathResource.replace('../src', '../backend/src');
            }
            return path.resolve(pathResource).replace(/\\/g, '/')
          })
          ,
      globalObject: 'this',
      // Prevents conflicts when multiple webpack runtimes (from different apps)
      // are used on the same page.
      jsonpFunction: `webpackJsonp${paths.appPackageJson.name}`,
    },
    module: {
      strictExportPresence: true,
      rules,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
          DEBUG: JSON.stringify(DEBUG),
          INTERCOM_APP_ID: JSON.stringify(INTERCOM_APP_ID),
          FEATURE_FLAG_KEY: JSON.stringify(FEATURE_FLAG_KEY),
          MODE_ANALYTICS_ACCESS_KEY: JSON.stringify(MODE_ANALYTICS_ACCESS_KEY),
          GOOGLE_API_KEY: JSON.stringify(GOOGLE_API_KEY),
          EXECUTION_ENVIRONMENT: JSON.stringify(EXECUTION_ENVIRONMENT),
          POLLING_FOLLOWUP_INTERVAL: JSON.stringify(POLLING_FOLLOWUP_INTERVAL),
          POLLING_SCHEDULE_INTERVAL: JSON.stringify(POLLING_SCHEDULE_INTERVAL),
          POLLING_REVENUE_INTERVAL: JSON.stringify(POLLING_REVENUE_INTERVAL),
          POLLING_VWR_INTERVAL: JSON.stringify(POLLING_VWR_INTERVAL),
          POLLING_UNREAD_CHAT_INTERVAL: JSON.stringify(POLLING_UNREAD_CHAT_INTERVAL),
          API_SERVER: JSON.stringify(apiHost.fullUrl),
          API_SERVER_HOST: JSON.stringify(apiHost.host),
          API_SERVER_PORT: JSON.stringify(apiHost.port),
          API_SERVER_PROTOCOL: JSON.stringify(apiHost.protocol),
          WORKFLOW_HOST: JSON.stringify(WORKFLOW_HOST),
          FORMS_HOST: JSON.stringify(FORMS_HOST),
          CHAT_HOST: JSON.stringify(CHAT_HOST),
          MY_SUBDOMAIN: JSON.stringify(MY_SUBDOMAIN),
        },
        VERSION: JSON.stringify(paths.appPackageJson.version),
        'typeof window': JSON.stringify('object'),
        PRODUCTION: JSON.stringify(true),
        BROWSER_SUPPORTS_HTML5: true,
      }),
      // Moment.js is an extremely popular library that bundles large locale files
      // by default due to how webpack interprets its code. This is a practical
      // solution that requires the user to opt into importing specific locales.
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      // You can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      ...pluginsForDevOrProd,
    ],
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
      minimize: isEnvProduction,
      moduleIds: 'hashed',
      minimizer: [
        // This is only used in production mode
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
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  inline: false,
                  annotation: true,
                }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: 'common',
        // added for caching, since these files will probrably not change for a long time
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 20,
          },
        },
      },
    },
    node: {
      console: true,
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
module.exports = webpackConfig;
