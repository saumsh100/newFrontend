const fs = require('fs');
const path = require('path');
const reduce = require('lodash/reduce');
const paths = require('../../webpack/helpers/paths');

const findBuiltAsset = (logicalPath) => {
  const clientFiles = fs.readdirSync(path.normalize(`${paths.appDist}/static/js`));
  const widgetFiles = fs.readdirSync(path.normalize(`${paths.appDist}/widget`));

  return [...clientFiles, ...widgetFiles]
    .filter((f) => f.endsWith('.js'))
    .find((f) => f.startsWith(logicalPath));
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
const readFile = (readPath) =>
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

module.exports = {
  findBuiltAsset,
  paths,
  replaceJavascriptFile,
  readFile,
};
