
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

// Babel Config Stuff.
const babelQuery = {
  es2015: require.resolve('babel-preset-es2015'),
  react: require.resolve('babel-preset-react'),
};

function createQuery(...paths) {
  return paths.map(resolvePath => `presets[]=${resolvePath}`).join(',');
}

const fullQuery = createQuery(babelQuery.es2015, babelQuery.react);

module.exports = {
  cache: true,
  context: __dirname,
  debug: true,
  devtool: 'cheap-module-source-map',
  entry: {},
  output: {},
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: `babel-loader?cacheDirectory,${createQuery(babelQuery.es2015)}`,
        exclude: /node_modules/,
      },
      {
        test: /\.jsx$/,
        loader: `babel-loader?cacheDirectory,${fullQuery}`,
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader' +
        '!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]' +
        '!postcss-loader!sass-loader?outputStyle=expanded&sourceMap',
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader?name=img/[name].[ext]',
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
        include: /flexboxgrid/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        exclude: /flexboxgrid/, // so we have to exclude it
      },
    ],
  },

  postcss() {
    return [autoprefixer];
  },

  resolveLoader: {
    // fallback: rootPath('node_modules'),
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};
