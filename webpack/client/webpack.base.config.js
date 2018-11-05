
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');
const path = require('path');
const { projectRoot } = require('../utils');

const localIdentName = '[name]__[local]___[hash:base64:5]';


const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
  cache: true,
  devtool: 'cheap-module-source-map',

  resolve: {
    extensions: ['.mjs', '.js', '.jsx'],
    symlinks: false,
    cacheWithContext: false
  },

  output: {
    path: path.resolve(projectRoot, 'statics/assets/'),
    publicPath: '/assets/',
    filename: '[name].js',
  },

  context: projectRoot,

  plugins: [
    new webpack.LoaderOptionsPlugin({ debug: isDevMode }),
  ],

  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
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
