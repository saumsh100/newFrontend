const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const merge = require('webpack-merge');
const devServer = require('./dev-server.config');

const devServerURL = `http://${devServer.host}:${devServer.port}`;
const extendWithDevApps = apps =>
  ['react-hot-loader/patch',
    `webpack-dev-server/client?${devServerURL}`,
    'webpack/hot/only-dev-server',
  ].concat(apps);

const projectRoot = process.cwd();

const developmentConfig = merge(baseConfig, {
  entry: {
    app: extendWithDevApps('./client/entries/app.js'),
    patient: extendWithDevApps('./client/entries/patient.js'),
  },

  output: {
    path: path.resolve(projectRoot, 'statics/assets/'),
    publicPath: '/assets/',
    filename: '[name].js',
  },

  context: projectRoot,

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.LoaderOptionsPlugin({ debug: true }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks: ['app', 'patient'],
    }),
  ],

  devServer,
});

module.exports = developmentConfig;
