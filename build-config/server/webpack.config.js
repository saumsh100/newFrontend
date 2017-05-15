const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const projectRoot = path.resolve(__dirname, '../..');

const externalModules = nodeModulesPath =>
  fs.readdirSync(nodeModulesPath)
    .filter(f => ['.bin'].indexOf(f) === -1)
    .reduce((map, mod) => Object.assign(map, { [mod]: `commonjs ${mod}` }), {});

const appEntries = (...list) => list.reduce((entries, app) =>
  Object.assign(entries, { [app]: ['babel-polyfill', `./server/bin/${app}.js`] }), {});

module.exports = {
  name: 'server',
  target: 'node',

  context: projectRoot,

  entry: appEntries('server', 'cron', 'reminders'),

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
            ],
          },
        },
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
    new webpack.IgnorePlugin(/\.(css|scss)$/),
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.BUNDLED': true,
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
};
