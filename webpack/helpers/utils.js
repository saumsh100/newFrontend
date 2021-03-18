const fs = require('fs');
const { EOL } = require('os');
const path = require('path');
const shell = require('shelljs');

const generatePublishPackage = require('../../scripts/generatePublishPackage');

/**
 * Convert list of names to wepbpack mapped entries
 * @param {Function} map
 */
const appEntries = map => (...list) =>
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
      ? name => [
        'core-js/stable',
        'regenerator-runtime/runtime',
        'react-hot-loader/patch',
        `./entries/${name}.js`,
      ]
      : name => `./client/entries/${name}.js`,
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
exports.readEnv = envPath =>
  fs
    .readFileSync(envPath)
    .toString()
    .split(EOL)
    .filter(l => l)
    .map(l => l.split('='))
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
    API_SERVER_PORT,
    API_SERVER_HOST,
    SERVER_PORT,
    SERVER_PROTOCOL,
    SERVER_HOST,
    USE_LOCAL_BACKEND,
  } = env;

  const shouldNotUseLocalBackend = USE_LOCAL_BACKEND === 'false';

  const localProductionHost = NODE_ENV === 'production' ? {
    host: '',
    port: '',
    protocol: 'https',
  } : {
    host: SERVER_HOST || 'localhost',
    port: SERVER_PORT ? `:${SERVER_PORT}` : ':5000',
    protocol: SERVER_PROTOCOL || 'http',
  }

  let { host, port, protocol } = localProductionHost;

  const checkForPort = () => {
    if (API_SERVER_PORT === '443') {
      protocol = 'https';
      return ''
    }
    return API_SERVER_PORT === '80' && protocol === 'https' ? '' : `:${API_SERVER_PORT}`
  };

  const checkForProtocol = () =>
      (NODE_ENV === 'production' || !host.includes('localhost') ? 'https' : protocol);

  if (shouldNotUseLocalBackend && API_SERVER_HOST) {
    const [tempProtocol, tempHost] = API_SERVER_HOST.includes('://') ? API_SERVER_HOST.split('://') : [checkForProtocol(), API_SERVER_HOST];
    host = tempHost;
    protocol = tempProtocol;
    port = API_SERVER_PORT ? checkForPort() : '';
  }

  return {
    host,
    port,
    protocol,
    fullUrl: host ? `${protocol}://${host}${port}` : '',
  };
};
