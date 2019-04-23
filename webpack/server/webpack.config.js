
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { appEntries } = require('../utils');
const packageJSON = require('../../package.json');

const nodeVersion = packageJSON.engines.node;
const projectRoot = path.resolve(__dirname, '../..');

const externalModules = nodeModulesPath =>
  fs
    .readdirSync(nodeModulesPath)
    .filter(f => ['.bin'].indexOf(f) === -1)
    .reduce((map, mod) => Object.assign(map, { [mod]: `commonjs ${mod}` }), {});

const entries = appEntries(name => ['babel-polyfill', `./server/bin/${name}.js`]);

module.exports = () => ({
  name: 'server',
  target: 'node',
  devtool: 'cheap-module-source-map',
  mode: process.env.NODE_ENV,

  context: projectRoot,

  entry: entries(
    'server',
    'cron',
    'reminders',
    'recalls',
    'reviews',
    'events',
    'firstNextLastApp',
    'correspondences',
    'patientCache',
    'updateSchema',
    'remindersJob',
    'reviewsJob',
  ),

  resolve: {
    alias: {
      CareCruModels$: path.resolve(projectRoot, './server/_models/index.js'),
      CareCruGraphQL: path.resolve(projectRoot, './server/graphql/'),
    },
    extensions: ['.js', '.jsx', '.css'],
    symlinks: false,
  },

  output: {
    path: path.resolve(projectRoot, './server/bin/build'),
    filename: '[name].bundle.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,

            presets: [['env', { targets: { node: nodeVersion } }], 'react', 'stage-2'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['isomorphic-style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  externals: {
    ...externalModules(path.resolve(projectRoot, 'node_modules')),
    sharp: 'commonjs sharp',
  },

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.BUNDLED': true,
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.ProvidePlugin({
      CCLogger: path.resolve(__dirname, './CCLogger.js'),
      S3Logger: path.resolve(__dirname, './S3Logger.js'),
    }),
  ],

  watchOptions: { ignored: /node_modules/ },
});
