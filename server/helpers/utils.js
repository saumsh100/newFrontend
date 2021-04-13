const fs = require('fs');
const path = require('path');
const axios  = require('axios');
const cheerio = require('cheerio');
const paths = require('../../webpack/helpers/paths');

// Importing from config is not working, the reason of why this code is needed here
const {
  API_SERVER,
  API_SERVER_PROTOCOL = 'http',
  API_SERVER_HOST = 'localhost',
  API_SERVER_PORT = '5000',
} = process.env;

const apiServer = API_SERVER || `${API_SERVER_PROTOCOL}://${API_SERVER_HOST}:${API_SERVER_PORT}`;

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

const getHtmlWithAccountInfo = async (accountId, app, cssClass = null) => {
  const url = `${apiServer}/public/${accountId}/initialState`;
  const initialdata = await axios.get(url).then((result) => result.data);

  const html = fs.readFileSync(app, 'utf8');
  const $ = cheerio.load(html);
  const scriptNode = `<script>
  window.accountId = '${accountId}';
  window.__INITIAL_STATE__ = ${JSON.stringify(initialdata.initialState)}
  </script>`;

  $('body').prepend(scriptNode);
  if (cssClass) {
    $('body').addClass('Widget');
  }

  return $.html();
}

module.exports = {
  findBuiltAsset,
  paths,
  readFile,
  getHtmlWithAccountInfo,
};
