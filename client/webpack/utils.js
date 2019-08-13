
const fs = require('fs');
const { EOL } = require('os');
const path = require('path');
const shell = require('shelljs');

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
      ? name => ['babel-polyfill', 'react-hot-loader/patch', `./entries/${name}.js`]
      : name => `./entries/${name}.js`,
  );

/**
 * Absolute path to project root
 */
exports.projectRoot = path.normalize(path.join(__dirname, '..'));

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
  buildPath = 'client/build',
  frontEndPackage = '@carecru/carecru',
} = {}) => {
  const serverPath = process.env.SERVER_PATH || shell.pwd().toString();

  console.log(
    `\nLinking "${buildPath}" to module ${frontEndPackage} on ${path.resolve(
      `${process.cwd()}${buildPath}`,
      serverPath,
    )}\n`,
  );
  shell.cd(buildPath);
  shell.exec('npm link');
  shell.cd(serverPath);
  shell.exec(`npm link ${frontEndPackage}`);
};
