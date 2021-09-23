const fs = require('fs');
const path = require('path');

const getPublicUrlOrPath = require('./getPublicUrlOrPath');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const appPackageJson = require('../../package.json');

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  appPackageJson.homepage,
  process.env.PUBLIC_URL,
);

const resolveEntry = (entry) => resolveApp(`client/entries/${entry}.js`);

const entries = {
  reviews: resolveEntry('reviews'),
  my: resolveEntry('my'),
  app: resolveEntry('app'),
};

const cc = {
  cc: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    'react-hot-loader/patch',
    resolveEntry('cc'),
  ],
};

const server = {
  server: [
    resolveApp('server/index.js'),
  ],
}

const paths = {
  appBuild: resolveApp('client/build'),
  appBuildWidget: resolveApp('client/build/widget'),
  appDist: resolveApp('dist/app'),
  appHtml: resolveApp('public/index.html'),
  appHtmlMy: resolveApp('public/my/index.html'),
  appIndexJs: resolveApp('client/index.jsx'),
  appJsConfig: resolveApp('jsconfig.json'),
  appPath: resolveApp('.'),
  appPublic: resolveApp('public'),
  appSrc: resolveApp('client'),
  dotenv: resolveApp('.env'),
  serverDist: resolveApp('dist'),
  appDirectory,
  appPackageJson,
  cc,
  entries,
  publicUrlOrPath,
  resolveApp,
  server,
};

module.exports = paths;
