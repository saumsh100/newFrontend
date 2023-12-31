const axios = require('axios');
const express = require('express');
const path = require('path');

const { findBuiltAsset, readFile, paths, getHtmlWithAccountInfo } = require('../helpers/utils');
const { apiProtocol, apiServer, reviewsApp } = require('../config');

const widgetsRouter = express.Router();

widgetsRouter.get('/:accountId/app(/*)?', async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const html = await getHtmlWithAccountInfo(accountId, reviewsApp, 'Widget');
    res.type('html').send(html);
  } catch (e) {
    next(e);
  }
});

widgetsRouter.get('/:accountId/cc.js', async (req, res, next) => {
  try {
    const toTemplateString = (str) => `\`${str}\``; // multi-line text
    const url = `${apiServer}/public/${req.params.accountId}`;
    const basicAccount = await axios.get(url).then((result) => result.data);

    const fileName = findBuiltAsset('cc');
    const jsPath = path.normalize(`${paths.appDist}/widget/${fileName}`);
    const cssPath = path.normalize(`${paths.appDist}/styles/widget.css`);

    // /book route by default to load widget
    const iframeSrc = `${apiProtocol}://${req.headers.host}/widgets/${basicAccount.id}/app`;
    let js = await readFile(jsPath);
    js = js.replace(new RegExp('.__CARECRU_ACCOUNT_ID__', 'g'), `['${basicAccount.id}']`);
    js = js.replace(
      new RegExp('"__CARECRU_STYLE_CSS__"', 'g'),
      toTemplateString(await readFile(cssPath)),
    );
    js = js.replace(
      new RegExp('__CARECRU_WIDGET_PRIMARY_COLOR__', 'g'),
      basicAccount.bookingWidgetPrimaryColor || '#574BD2',
    );
    js = js.replace(
      new RegExp('__CARECRU_WIDGET_BUTTON_LABEL__', 'g'),
      basicAccount.bookingWidgetButtonLabel,
    );
    js = js.replace(new RegExp('__CARECRU_EXTERNAL_ID__', 'g'), basicAccount?.externalId);
    js = js.replace(new RegExp('__CARECRU_PRACTICE_NAME__', 'g'), basicAccount?.name);
    js = js.replace(new RegExp('__CARECRU_ACC_ID__', 'g'), basicAccount.id);

    js = js.replace(new RegExp('__CARECRU_IFRAME_SRC__', 'g'), iframeSrc);

    res.type('javascript').send(js);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

const myWidgetRenderRouter = express.Router();
myWidgetRenderRouter.use('/widgets', widgetsRouter);

module.exports = myWidgetRenderRouter;
