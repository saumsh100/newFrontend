const fs = require('fs');
const path = require('path');
const reduce = require('lodash/reduce');
const paths = require('../webpack/helpers/paths');

const { getCompleteHost } = require('../webpack/helpers/utils');

const findBuiltAsset = (logicalPath) => {
  const clientFile = fs.readdirSync(path.join(paths.appBuild, 'static', 'js'));
  const widgetFile = fs.readdirSync(paths.appBuildWidget);

  return [...clientFile, ...widgetFile]
    .filter(f => f.endsWith('.js'))
    .find(f => f.startsWith(logicalPath));
};

function replaceIndex(string, regex, index, repl) {
  let nth = -1;
  return string.replace(regex, (match) => {
    nth += 1;
    if (index === nth) return repl;
    return match;
  });
}

/**
 *
 * @param readPath
 * @param config
 * @returns {Promise.<*>}
 */
const readFile = readPath =>
  new Promise((resolve, reject) => {
    fs.readFile(readPath, 'utf8', (err, strContent) => {
      if (err) return reject(err);
      return resolve(strContent);
    });
  });

/**
 *
 * @param path
 * @param config
 * @returns {Promise.<*>}
 */
const replaceJavascriptFile = async (readPath, config) => {
  const js = await readFile(readPath);
  return reduce(config, (result, value, key) => {
    const before = `"${key}"`;
    const after = value;
    return replaceIndex(result, new RegExp(before, 'g'), 0, after);
  }, js);
};

const getHost = getCompleteHost;

module.exports = {
  findBuiltAsset,
  paths,
  getHost,
  replaceJavascriptFile,
  readFile,
};
