const fs = require('fs');
const path = require('path');
const paths = require('../../webpack/helpers/paths');

const findBuiltAsset = (logicalPath) => {
  const clientFiles = fs.readdirSync(path.normalize(`${paths.appDist}/static/js`));
  const widgetFiles = fs.readdirSync(path.normalize(`${paths.appDist}/widget`));

  return [...clientFiles, ...widgetFiles]
    .filter((f) => f.endsWith('.js'))
    .find((f) => f.startsWith(logicalPath));
};

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

module.exports = {
  findBuiltAsset,
  paths,
  readFile,
};
