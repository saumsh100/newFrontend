
//const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const path = require('path');

//function relativePath(additionalPath) {
//  return path.join('../../', additionalPath);
//}

webpackConfig.devtool = 'eval-cheap-module-source-map';

//webpackConfig.output.path = path.join(__dirname, '../../test/assets/');
//webpackConfig.output.publicPath = path.join(__dirname, '../../test/assets/');

// Let karma handle most of the configuration.
webpackConfig.entry = {};

webpackConfig.plugins = [];

module.exports = webpackConfig;
