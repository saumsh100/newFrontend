
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const { entries, projectRoot } = require('./utils');

const {
  NODE_ENV,
  INTERCOM_APP_ID,
  FEATURE_FLAG_KEY,
  MODE_ANALYTICS_ACCESS_KEY,
  GOOGLE_API_KEY,
} = process.env;

const localIdentName = '[name]__[local]___[hash:base64:5]';
const isDevMode = NODE_ENV === 'development';

module.exports = {
  cache: true,
  devtool: 'cheap-module-source-map',
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
  },

  context: projectRoot,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        INTERCOM_APP_ID: JSON.stringify(INTERCOM_APP_ID),
        FEATURE_FLAG_KEY: JSON.stringify(FEATURE_FLAG_KEY),
        MODE_ANALYTICS_ACCESS_KEY: JSON.stringify(MODE_ANALYTICS_ACCESS_KEY),
        GOOGLE_API_KEY: JSON.stringify(GOOGLE_API_KEY),
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

    new webpack.LoaderOptionsPlugin({ debug: isDevMode }),
  ],

  module: {
    rules: [
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
            cacheDirectory: true,
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
              modules: true,
              sourceMap: isDevMode,
              minimize: true,
              localIdentName,
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
              sourceMap: isDevMode,
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
              modules: true,
              sourceMap: isDevMode,
              minimize: true,
              localIdentName,
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
