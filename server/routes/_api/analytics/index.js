
import signUrl from '../../../lib/thirdPartyIntegrations/modeAnalytics';
import { modeAnalytics } from '../../../config/globals';

const analyticsRouter = require('express').Router();

analyticsRouter.get('/signUrl', async ({ query }, res, next) => {
  try {
    const { url } = query;
    const timestamp = Math.floor(Date.now() / 1000);
    const signedUrl = signUrl({
      url,
      key: modeAnalytics.accessKey,
      secret: modeAnalytics.secret,
      timestamp,
    });

    res.send({ url: signedUrl });
  } catch (err) {
    next(err);
  }
});

module.exports = analyticsRouter;
