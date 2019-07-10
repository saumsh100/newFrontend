
import { Router } from 'express';
import subdomain from 'express-subdomain';
import graphQLRouter from 'CareCruGraphQL/server';
import apiRouter from './_api';
import myRouter from './_api/my';
import authRouter from './_auth';
import callsRouter from './_callrail';
import twilioRouter from './_twilio';
import signupRouter from './_signup';
import vendastaRouter from './_vendasta';
import resetRouter from './reset';
import myWidgetRenderRouter from './widgets';
import { Invite, PasswordReset, User } from '../_models';
import graphQLClient from '../util/graphQLClient';
import httpClient from '../util/httpClient';
import { sequelizeAuthMiddleware } from '../middleware/auth';
import isFeatureFlagEnabled from '../lib/featureFlag';
import { newApiUrl } from '../config/globals';

const NEW_API_PATH = '/newapi';

const rootRouter = Router();

// Bind subdomain capturing
rootRouter.use(subdomain('my', myWidgetRenderRouter));

// Bind auth route to generate tokens
rootRouter.use('/auth', authRouter);

rootRouter.use('/signup', signupRouter);
rootRouter.use('/resetpassword', resetRouter);

// Bind REST API
rootRouter.use('/my', myRouter);
rootRouter.use('/api', apiRouter);

// Bind GraphQL endpoint
rootRouter.use('/graphql', graphQLRouter);
rootRouter.post(
  '/newgraphql',
  sequelizeAuthMiddleware,
  async (req, res, next) => {
    try {
      const { data } = await graphQLClient(req.body);

      res.send(data);
    } catch ({ data }) {
      res.status(400).send(data);
    }
  },
);

// New API Proxy
rootRouter.all(
  NEW_API_PATH,
  sequelizeAuthMiddleware,
  async (req, res, next) => {
    try {
      const processedUrl = req.originalUrl.replace(NEW_API_PATH, '');

      const { data } = await httpClient(newApiUrl + processedUrl, req.method, req.body);

      res.send(data);
    } catch (err) {
      next(err);
    }
  },
);

// Webhooks!
rootRouter.use('/twilio', twilioRouter);
rootRouter.use('/callrail', callsRouter);
rootRouter.use('/vendasta', vendastaRouter);

rootRouter.get('/signupinvite/:tokenId', (req, res, next) =>
  Invite.findOne({
    where: { token: req.params.tokenId },
    paranoid: false,
  })
    .then((invite) => {
      if (!invite) {
        // TODO: replace with StatusError
        return res.status(404).send('404 NOT FOUND');
      } else if (invite && invite.deletedAt) {
        return res.status(404).send('Invite Expired/Cancelled');
      }
      res.redirect(`/signup/${req.params.tokenId}`);
    })
    .catch(next));

// below route is sequelize
rootRouter.get('/reset/:tokenId', (req, res, next) =>
  PasswordReset.findOne({ where: { token: req.params.tokenId } })
    .then((reset) => {
      if (!reset) {
        // TODO: replace with StatusError
        res.status(404).send();
      } else {
        res.redirect(`/resetpassword/${req.params.tokenId}`);
      }
    })
    .catch(next));

rootRouter.post('/userCheck', (req, res, next) => {
  const username = req.body.email.toLowerCase().trim();
  User.findOne({ where: { username } })
    .then((user) => {
      res.send({ exists: !!user });
    })
    .catch(next);
});

// All other traffic, just render app
// TODO: Need to update client-side router to handle this
rootRouter.get('(/*)?', async (req, res, next) => {
  // TODO: this should be wrapped in a try catch
  const showNewFont = await isFeatureFlagEnabled('show-new-font', null, {
    userId: 'carecru-api',
    domain: req.hostname,
  });

  return res.render('app', { showNewFont });
});

module.exports = rootRouter;
