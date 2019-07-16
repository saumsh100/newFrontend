
import { Router } from 'express';
import normalize from '../_api/normalize';
import { assetsPath, protocol } from '../../config/globals';
import { readFile, replaceJavascriptFile } from '../../util/file';
import { sequelizeLoader } from '../util/loaders';
import { Practitioner } from '../../_models';
import { findBuiltAsset } from '../../config/jsxTemplates';
import myRouter from '../_api/my';

const widgetsRouter = Router();

widgetsRouter.param('accountId', sequelizeLoader('account', 'Account'));
widgetsRouter.param(
  'accountIdJoin',
  sequelizeLoader('account', 'Account', [
    {
      association: 'services',
      required: false,
      where: { isHidden: { $ne: true } },
      order: [['name', 'ASC']],
      include: [{ model: Practitioner,
        as: 'practitioners' }],
    },
    {
      association: 'practitioners',
      required: false,
      where: { isActive: true },
    },
    { association: 'weeklySchedule',
      required: false },
  ]),
);

/**
 * GET /:accountId/embed
 *
 * - 200 serves reviews embed page
 * - 404 :accountId does not exist
 */
widgetsRouter.get('/:accountIdJoin/app(/*)?', async (req, res, next) => {
  try {
    const { entities } = normalize('account', req.account.get({ plain: true }));
    const selectedServiceId =
      req.account.services.filter(s => s.isDefault).map(s => s.id)[0] || null;

    const responseAccount = req.account.get({ plain: true });
    const responseServices = req.account.services.map(service => service.get({ plain: true }));

    const responsePractitioners = req.account.practitioners.map(practitioner =>
      practitioner.get({ plain: true }));

    const { account } = req;
    const { weeklySchedule } = account;
    const rawAccount = account.get({ plain: true });
    const rawWeeklySchedule = weeklySchedule && weeklySchedule.get({ plain: true });
    const initialState = {
      availabilities: {
        account: responseAccount,
        services: responseServices,
        practitioners: responsePractitioners,
        selectedServiceId,
        officeHours: rawWeeklySchedule,
      },

      entities,

      reviews: {
        account: rawAccount,
      },
    };

    res.render('reviews', {
      account: rawAccount,
      initialState: JSON.stringify(initialState),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:accountId/cc.js
 *
 * This is a very important route that returns
 *
 */

const toString = str => `'${str}'`; // single-line text
const toTemplateString = str => `\`${str}\``; // multi-line text

widgetsRouter.get('/:accountId/cc.js', async (req, res, next) => {
  try {
    const { account } = req;
    const cwd = process.cwd();
    const fileName = findBuiltAsset('cc');
    const jsPath = `${assetsPath}/widget/${fileName}`;
    const cssPath = `${cwd}/server/routes/_api/my/widgets/widget.css`;

    // /book route by default to load widget
    const iframeSrc = `${protocol}://${req.headers.host}/widgets/${account.id}/app`;
    const js = await replaceJavascriptFile(jsPath, {
      __CARECRU_ACCOUNT_ID__: toString(account.id),
      __CARECRU_WIDGET_PRIMARY_COLOR__: toString(account.bookingWidgetPrimaryColor || '#FF715A'),
      __CARECRU_STYLE_CSS__: toTemplateString(await readFile(cssPath)),
      __CARECRU_IFRAME_SRC__: toString(iframeSrc),
    });

    res.type('javascript').send(js);
  } catch (err) {
    next(err);
  }
});

const myWidgetRenderRouter = Router();

myWidgetRenderRouter.use('/widgets', widgetsRouter);

/**
 * This route is needed here to proxy my.carecru requests to the same controllers
 * that www.carecru uses so we can rely only on relative paths on the frontend
 */
myWidgetRenderRouter.use('/my', myRouter);

myWidgetRenderRouter.get('(/*)?', (req, res, next) => {
  try {
    res.render('my');
  } catch (err) {
    next(err);
  }
});

module.exports = myWidgetRenderRouter;
