
const webpack = require('webpack');
const webpackConfig = require('./webpack.development.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const _ = require('lodash');

// Babel Config Stuff.
const babelQuery = {
  es2015: require.resolve('babel-preset-es2015'),
  react: require.resolve('babel-preset-react'),
};

function createQuery(...paths) {
  return paths.map(resolvePath => `presets[]=${resolvePath}`).join(',');
}

const fullQuery = createQuery(babelQuery.es2015, babelQuery.react);

// webpackConfig.devtool = 'eval-cheap-module-source-map';
webpackConfig.devtool = 'source-map';

// Rewrite the entry scripts to exclude the development server files.
webpackConfig.entry = _.mapValues(webpackConfig.entry, entry => _.last(entry));
webpackConfig.module.loaders = [
  {
    test: /\.js$/,
    loader: `babel-loader?${createQuery(babelQuery.es2015)}`,
    exclude: /(node_modules|vendor)/,
  },
  {
    test: /\.jsx$/,
    loader: `babel-loader?${fullQuery}`,
    exclude: /(node_modules|vendor)/,
  },
  { test: /\.json$/, loader: 'json-loader' },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      'style-loader',
      '!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]' +
      '!postcss-loader!sass-loader?outputStyle=expanded'
    ),
  },
  { test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=img/[name].[ext]' },
  {
    test: /\.(ttf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?(\?[a-z0-9]+)?$/,
    loader: 'file-loader',
  },
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      'style-loader',
      'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]'
    ),
    include: /flexboxgrid/,
  },
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
    exclude: /flexboxgrid/, // so we have to exclude it
  },
];

webpackConfig.plugins = [
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.CommonsChunkPlugin('app-commons.js', ['app']),
  /*new webpack.optimize.CommonsChunkPlugin('default-commons.js', [
    'login',
    'accept',
    'acceptAuthenticated',
    'signup',
    'account',
  ]),*/
  new ExtractTextPlugin('[name].css', {
    // allChunks: true,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
];

module.exports = webpackConfig;
