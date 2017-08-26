
import fs from 'fs';
import reduce from 'lodash/reduce';

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
 * @param path
 * @param config
 * @returns {Promise.<*>}
 */
export function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, strContent) => {
      if (err) return reject(err);
      resolve(strContent);
    });
  });
}

/**
 *
 * @param path
 * @param config
 * @returns {Promise.<*>}
 */
export async function replaceJavascriptFile(path, config) {
  const js = await readFile(path);
  return reduce(config, (result, value, key) => {
    return replaceIndex(result, new RegExp(key, 'g'), 0, `"${value}`);
  }, js);
}
