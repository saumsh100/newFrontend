const { EOL } = require('os');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const generatePublishPackage = require('../../scripts/generatePublishPackage');

/**
 * Convert list of names to wepbpack mapped entries
 * @param {Function} map
 */
const appEntries = (map) => (...list) =>
  list.reduce(
    (entries, app) => ({
      ...entries,
      [app]: map(app),
    }),
    {},
  );

exports.appEntries = appEntries;

exports.entries = (isDevMode = false) =>
  appEntries(
    isDevMode
      ? (name) => [
          'core-js/stable',
          'regenerator-runtime/runtime',
          'react-hot-loader/patch',
          `./entries/${name}.js`,
        ]
      : (name) => `./client/entries/${name}.js`,
  );

/**
 * Absolute path to project root
 */
exports.projectRoot = path.normalize(path.join(__dirname, '..', 'client'));

/**
 * Parse env file into object
 * @param {string} envPath - path to env file
 * @returns {object}
 */
exports.readEnv = (envPath) =>
  fs
    .readFileSync(envPath)
    .toString()
    .split(EOL)
    .filter((l) => l)
    .map((l) => l.split('='))
    .reduce((obj, [l, r]) => Object.assign(obj, { [l]: r }), {});

/**
 * Links the build folder to node_modules using npm link
 */
exports.linkFrontEndModule = ({
  buildPath = 'client/build/',
  frontEndPackage = '@carecru/carecru',
} = {}) => {
  const serverPath = process.env.SERVER_PATH || shell.pwd().toString();
  const linkServerPath = path.resolve(`${process.cwd()}${buildPath}`, serverPath);
  console.log(`\nLinking "${buildPath}" to module ${frontEndPackage} on ${linkServerPath}\n`);

  generatePublishPackage(buildPath);

  shell.cd(buildPath);
  shell.exec('npm link');
  shell.cd(serverPath);
  shell.exec(`npm link ${frontEndPackage}`);
};

exports.getCompleteHost = (env) => {
  const {
    NODE_ENV,
    API_SERVER,
  } = env;

  const localProductionHost =
    NODE_ENV === 'production'
      ? {
          host: '',
          port: '',
          protocol: 'https',
        }
      : {
          host: 'localhost',
          port: ':5000',
          protocol: 'http',
        };

  let { host, port, protocol } = localProductionHost;

  const checkForPort = () => {
    if (API_SERVER.includes(':443')) {
      protocol = 'https';
      return '';
    }
    const tempHost = API_SERVER.includes('://') ? API_SERVER.split('://')[1] : API_SERVER;
    const tempPort = tempHost.includes(':') ? tempHost.split(':')[1] : null;

    if (tempPort) {
      return tempPort === ('80') && protocol === 'https' ? '' : `:${tempPort}`;
    }

    return '';
  };

  const checkProtocolForLocalhost = (tempHost) =>
    tempHost.includes('localhost') ? 'http' : protocol;

  const checkForProtocol = (tempHost = host) =>
    NODE_ENV === 'production' && !tempHost.includes('localhost')
      ? 'https'
      : checkProtocolForLocalhost(tempHost);

  if (API_SERVER) {
    const [tempProtocol, tempHost] = API_SERVER.includes('://')
      ? API_SERVER.split('://')
      : [checkForProtocol(API_SERVER), API_SERVER.split(':')[0]];
    host = tempHost.split(':')[0];
    protocol = tempProtocol;
    port = checkForPort();
  }

  return {
    host,
    port,
    protocol,
    fullUrl: host ? `${protocol}://${host}${port}` : '',
  };
};
