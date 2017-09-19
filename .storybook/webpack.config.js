// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config
const cssnext = require('postcss-cssnext');
const path = require('path');
const localIdentName = '[name]__[local]___[hash:base64:5]';


// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

module.exports = (storybookBaseConfig, configType) => {
  storybookBaseConfig.resolve.extensions.push('.js', '.jsx')

  storybookBaseConfig.module.rules.push(
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../')
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
              localIdentName,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                cssnext({
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
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?(\?[a-z0-9]+)?$/,
        use: 'file-loader',
        include: path.resolve(__dirname, '../')
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
        include: path.resolve(__dirname, '../')
      },
    );

  return storybookBaseConfig;
};


