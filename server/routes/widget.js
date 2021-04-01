const axios  = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');
const path = require('path');

const { findBuiltAsset, replaceJavascriptFile, readFile, paths } = require('../helpers/utils');
const { apiProtocol, apiServer, onlineBookingApp, reviewsApp } = require('../config');

const widgetsRouter = express.Router();

widgetsRouter.get('/:accountIdJoin/app(/*)?', async (req, res, next) => {
  try {
    const accountId = req.params.accountIdJoin;
    const url = `${apiServer}/public/${accountId}/initialState`;

    const initialdata = await axios.get(url).then((result) => result.data);

    const html = fs.readFileSync(reviewsApp, 'utf8');
    const $ = cheerio.load(html);
    const scriptNode = `<script>
    window.accountId = '${accountId}';
    window.__INITIAL_STATE__ = ${JSON.stringify(initialdata.initialState)}
    </script>`;

    $('body').prepend(scriptNode);
    $('body').addClass('Widget');

    res.type('html').send($.html());
  } catch (e) {
    next(e)
  }
});

widgetsRouter.get('/:accountId/cc.js', async (req, res, next) => {
  try {
    const toString = (str) => `'${str}'`; // single-line text
    const toTemplateString = (str) => `\`${str}\``; // multi-line text
    const url = `${apiServer}/public/${req.params.accountId}`
    const basicAccount = await axios.get(url).then((result) => result.data);

    const fileName = findBuiltAsset('cc');
    const jsPath = path.normalize(`${paths.appDist}/widget/${fileName}`);
    const cssPath = path.normalize(`${paths.appDist}/styles/widget.css`);

    // /book route by default to load widget
    const iframeSrc = `${apiProtocol}://${req.headers.host}/widgets/${basicAccount.id}/app`;
    const js = await replaceJavascriptFile(jsPath, {
      __CARECRU_ACCOUNT_ID__: toString(basicAccount.id),
      __CARECRU_WIDGET_PRIMARY_COLOR__: toString(basicAccount.bookingWidgetPrimaryColor || '#FF715A'),
      __CARECRU_STYLE_CSS__: toTemplateString(await readFile(cssPath)),
      __CARECRU_IFRAME_SRC__: toString(iframeSrc),
    });

    res.type('javascript').send(js);

  } catch (e) {
    next(e)
  }
});

const myWidgetRenderRouter = express.Router();
myWidgetRenderRouter.use('/widgets', widgetsRouter);

// This route is for the `online booking` app
myWidgetRenderRouter.get('(/*)?', (req, res, next) => {
  res.sendFile(onlineBookingApp);
});

module.exports = myWidgetRenderRouter;
