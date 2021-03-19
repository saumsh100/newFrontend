/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */

'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000', 10);

process.env.BABEL_ENV = process.env.NODE_ENV;

const { NODE_ENV, SOURCE } = process.env;

const localIdentName = '[name]__[local]___[hash:base64:5]';
const isEnvDevelopment = NODE_ENV === 'development';
const isEnvProduction = NODE_ENV === 'production';
const shouldUseSourceMap = SOURCE === 'true';

const getCacheIdentifier = (environment, packages) => {
  let cacheIdentifier = environment == null ? '' : environment.toString();
  packages.forEach(packageName => {
    cacheIdentifier += `:${packageName}@`;
    try {
      cacheIdentifier += require(`${packageName}/package.json`).version;
    } catch (_) {
      // ignored
    }
  });
  return cacheIdentifier;
};

const getStyleLoaders = (extractCss, cssOptions, isSass = false) => {
  const postcssNormalize = require('postcss-normalize');

  const loaders = [
    (isEnvDevelopment || isSass || !extractCss) && require.resolve('style-loader'),
    isEnvProduction &&
      !isSass &&
      extractCss && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {},
      },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            features: {
              customProperties: false,
            },
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          postcssNormalize(),
        ],
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
      },
    },
  ].filter(Boolean);
  if (isSass) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          root: paths.appSrc,
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          implementation: require('node-sass'),
          outputStyle: 'expanded',
          sassOptions: {
            indentWidth: 4,
            sourceComments: true,
          },
          sourceMap: true,
        },
      },
    );
  }
  return loaders;
};

const rules = (extractCss = false) => [
  { parser: { requireEnsure: false } },
  {
    // "oneOf" will traverse all following loaders until one will
    // match the requirements. When no loader matches it will fall
    // back to the "file" loader at the end of the loader list.
    oneOf: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: imageInlineSizeLimit,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|mjs|jsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: true,
          configFile: path.join(process.cwd(), './.babelrc'),
          cacheIdentifier: getCacheIdentifier(
            isEnvProduction ? 'production' : isEnvDevelopment && 'development',
            ['babel-plugin-named-asset-import', 'babel-preset-react-app'],
          ),
          cacheDirectory: true,
          cacheCompression: false,
          compact: isEnvProduction,
        },
      },
      {
        test: /\.(js|mjs)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: true,
          compact: false,
          configFile: path.join(process.cwd(), './.babelrc'),
          cacheDirectory: true,
          cacheCompression: false,
          cacheIdentifier: getCacheIdentifier(
            isEnvProduction ? 'production' : isEnvDevelopment && 'development',
            ['babel-plugin-named-asset-import', 'babel-preset-react-app'],
          ),
          sourceMaps: shouldUseSourceMap,
          inputSourceMap: shouldUseSourceMap,
        },
      },
      {
        test: /\.css$/,
        use: getStyleLoaders(extractCss, {
          // importLoaders: 1,
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        }),
        sideEffects: true,
      },
      {
        test: /\.s(a|c)ss$/,
        use: getStyleLoaders(
          extractCss,
          {
            importLoaders: 3,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              localIdentName,
            },
          },
          true,
        ),
        sideEffects: true,
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      // This loader doesn't use a "test" so it will catch all modules
      // that fall through the other loaders.
      {
        loader: require.resolve('file-loader'),
        // Exclude `js` files to keep "css" loader working as it injects
        // its runtime that would otherwise be processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
];

module.exports = rules;
