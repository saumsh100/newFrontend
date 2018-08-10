
const postcssPresetEnv = require('postcss-preset-env');
const path = require('path');
const { projectRoot } = require('../utils');

const localIdentName = '[name]__[local]___[hash:base64:5]';

module.exports = {
  cache: true,
  devtool: 'cheap-module-source-map',

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  output: {
    path: path.resolve(projectRoot, 'statics/assets/'),
    publicPath: '/assets/',
    filename: '[name].js',
  },

  context: projectRoot,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
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
              sourceMap: true,
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
              sourceMap: true,
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
