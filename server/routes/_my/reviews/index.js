
import { Router } from 'express';
import fs from 'fs';
import { Review } from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';
import { readFile, replaceJavascriptFile } from '../../../util/file';
import normalize from '../../_api/normalize';

const reviewsRouter = Router();

reviewsRouter.param('accountId', sequelizeLoader('account', 'Account'));
reviewsRouter.param('reviewId', sequelizeLoader('review', 'Review'));
reviewsRouter.param('accountIdJoin', sequelizeLoader('account', 'Account', [
  { association: 'services', required: false, where: { isHidden: { $ne: true } }, order: [['name', 'ASC']] },
  { association: 'practitioners', required: false, where: { isActive: true } },
]));

/**
 * GET /:accountId/embed
 *
 * - 200 serves reviews embed page
 * - 404 :accountId does not exist
 */
reviewsRouter.get('/:accountIdJoin/embed(/*)?', async (req, res, next) => {
  try {
    const { entities } = normalize('account', req.account.get({ plain: true }));
    let selectedServiceId = (req.account.services[0] ? req.account.services[0].id : null);
    for (let i = 0; i < req.account.services.length; i++) {
      if (req.account.services[i].isDefault) {
        selectedServiceId = req.account.services[i].id;
      }
    }

    const responseAccount = req.account.get({ plain: true });
    const responseServices = req.account.services.map((service) => {
      return service.get({ plain: true });
    });

    const responsePractitioners = req.account.practitioners.map((practitioner) => {
      return practitioner.get({ plain: true });
    });

    const { account } = req;
    const rawAccount = account.get({ plain: true });
    const initialState = {
      availabilities: {
        account: responseAccount,
        services: responseServices,
        practitioners: responsePractitioners,
        selectedServiceId,
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


function replaceIndex(string, regex, index, repl) {
  let nth = -1;
  return string.replace(regex, (match) => {
    nth += 1;
    if (index === nth) return repl;
    return match;
  });
}

reviewsRouter.get('/:accountId/reviews.js', async (req, res, next) => {
  try {
    const account = req.account.get({ plain: true });
    fs.readFile(getPath('widget.js'), 'utf8', (err, widgetJS) => {
      if (err) throw err;
      fs.readFile(getPath('widget.css'), 'utf8', (_err, widgetCSS) => {
        if (_err) throw _err;
        const color = account.bookingWidgetPrimaryColor || '#FF715A';
        const iframeSrc = `${req.protocol}://${req.headers.host}/reviews/${account.id}/embed`;
        const withColor = replaceIndex(widgetJS, /__REPLACE_THIS_COLOR__/g, 1, toString(color));
        const withSrc = replaceIndex(withColor, /__REPLACE_THIS_IFRAME_SRC__/g, 1, toString(iframeSrc));
        const withStyleText = replaceIndex(withSrc, /__REPLACE_THIS_STYLE_TEXT__/g, 1, toTemplateString(widgetCSS));
        // TODO: need to be able to minify and compress code UglifyJS
        res.send(withStyleText);
      });
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:accountId
 *
 * - 201 sends down the created review data
 * - 404 :accountId does not exist
 */
reviewsRouter.post('/:accountId', async (req, res, next) => {
  try {
    const { account } = req;
    const reviewData = Object.assign({}, req.body, { accountId: account.id });
    const review = await Review.create(reviewData);
    res.status(201).send(review.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /:reviewId
 *
 * - 200 sends updated review
 * - 404 review with :reviewId does not exist
 */
reviewsRouter.put('/:reviewId', async (req, res, next) => {
  try {
    const { review } = req;
    const updatedReview = await review.update(req.body);
    res.send(updatedReview.get({ plain: true }));
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

reviewsRouter.get('/:accountId/cc.js', async (req, res, next) => {
  try {
    const { account } = req;
    const cwd = process.cwd();
    const jsPath = `${cwd}/statics/assets/cc.js`;
    const cssPath = `${cwd}/server/routes/_my/reviews/widget.css`;
    const iframeSrc = `${req.protocol}://${req.headers.host}/reviews/${account.id}/embed`;
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

export default reviewsRouter;
