const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { appEntries } = require('../utils');

const projectRoot = path.resolve(__dirname, '../..');

const externalModules = nodeModulesPath =>
  fs.readdirSync(nodeModulesPath)
    .filter(f => ['.bin'].indexOf(f) === -1)
    .reduce((map, mod) => Object.assign(map, { [mod]: `commonjs ${mod}` }), {});

const entries = appEntries(name => [
  'babel-polyfill',
  `./server/bin/${name}.js`,
]);

module.exports = {
  name: 'server',
  target: 'node',

  context: projectRoot,

  entry: entries('server', 'cron', 'reminders'),

  resolve: {
    extensions: ['.js', '.jsx'],
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
            presets: [
              ['env', { targets: { node: 6.2 } }],
              'react',
              'stage-2',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['isomorphic-style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['isomorphic-style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  externals: externalModules(path.resolve(projectRoot, 'node_modules')),

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
  ],
};
