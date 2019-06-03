
const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config');
const { entries, projectRoot } = require('./utils');

const developmentConfig = merge.strategy({
  entry: 'replace',
})(baseConfig, {
  mode: 'production',
  entry: entries(true)('cc'),
  output: {
    path: path.resolve(projectRoot, 'build/widget'),
  },
});

module.exports = developmentConfig;
