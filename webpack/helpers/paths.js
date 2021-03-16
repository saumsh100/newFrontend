/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-nested-ternary */
/* eslint-disable operator-linebreak */
const fs = require('fs');
const path = require('path');
const getPublicUrlOrPath = require('./getPublicUrlOrPath');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL,
);

const resolveEntry = entry => resolveApp(`client/entries/${entry}.js`);

const entries = {
  reviews: resolveEntry('reviews'),
  my: resolveEntry('my'),
  app: resolveEntry('app'),
  // hub: resolveEntry('hub'),
};

const cc = {
  cc: ['core-js/stable', 'regenerator-runtime/runtime', 'react-hot-loader/patch', resolveEntry('cc')],
};

const appPackageJson = require(resolveApp('package.json'));

const paths = {
  appBuild: resolveApp('client/build'),
  appDist: resolveApp('server/dist'),
  appBuildWidget: resolveApp('client/build/widget'),
  appSrc: resolveApp('client'),
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appHtmlMy: resolveApp('public/my/index.html'),
  appIndexJs: resolveApp('client/index.jsx'),
  appJsConfig: resolveApp('jsconfig.json'),
  publicUrlOrPath,
  entries,
  cc,
  resolveApp,
  appDirectory,
  appPackageJson,
};

module.exports = paths;
