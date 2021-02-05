
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const { entries, projectRoot } = require('./utils');

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
} = process.env;

const localIdentName = '[name]__[local]___[hash:base64:5]';
const isDevMode = NODE_ENV === 'development';
const shouldUseSourceMap = SOURCE === 'true';

module.exports = {
  cache: true,
  resolve: {
    extensions: ['.mjs', '.js', '.jsx'],
    symlinks: false,
    cacheWithContext: false,
  },

  entry: entries(isDevMode)('app', 'reviews', 'my', 'hub'),
  output: {
    path: path.resolve(projectRoot, 'build'),
    publicPath: '/assets/',
    filename: '[name].[contenthash].js',
    globalObject: 'this',
  },

  context: projectRoot,
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
      },
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!widget',
        '!widget/*',
        '!package.json',
        '!.gitignore',
      ],
    }),
  ],

  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            configFile: path.join(process.cwd(), './.babelrc'),
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName,
              },
              importLoaders: 2,
              sourceMap: isDevMode || shouldUseSourceMap,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                postcssPresetEnv({
                  features: {
                    customProperties: false,
                  },
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: isDevMode || shouldUseSourceMap,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?(\?[a-z0-9]+)?$/,
        use: 'file-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevMode || shouldUseSourceMap,
              modules: {
                localIdentName,
              },
            },
          },
        ],
        include: /flexboxgrid/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /flexboxgrid/, // so we have to exclude it
      },
    ],
  },

  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
