
import { Router } from 'express';
import subdomain from 'express-subdomain';
import url from 'url';
import sequelizeApiRouter from './_api';
import sequelizeAuthRouter from './_auth';
import callsRouterSequelize from './_callrail';
import sequelizeMyRouter from './_my';
import connectRouter from './connect';
import twilioRouterSequelize from './_twilio';
import signupRouterSequelize from './_signup';
import resetRouter from './reset';
import {
  Account,
  Appointment,
  Invite,
  Patient,
  Token,
  PasswordReset,
  User,
} from '../_models';

const rootRouter = Router();

// Bind subdomain capturing
// Will be removed once microservices are in full effect
rootRouter.use(subdomain('my', sequelizeMyRouter));
rootRouter.use(subdomain('my2', sequelizeMyRouter));
rootRouter.use(subdomain('connect', connectRouter));

// Bind auth route to generate tokens
rootRouter.use('/_auth', sequelizeAuthRouter);
rootRouter.use('/auth', sequelizeAuthRouter);

rootRouter.use('/signup', signupRouterSequelize);
rootRouter.use('/resetpassword', resetRouter); // this is sequelize
rootRouter.use('/_signup', signupRouterSequelize);

// Bind REST API
rootRouter.use('/_api', sequelizeApiRouter);
rootRouter.use('/api', sequelizeApiRouter);

// Webhooks!
rootRouter.use('/twilio', twilioRouterSequelize);
rootRouter.use('/_twilio', twilioRouterSequelize);
rootRouter.use('/callrail', callsRouterSequelize);
rootRouter.use('/_callrail', callsRouterSequelize);

rootRouter.get('/signupinvite/:tokenId', (req, res, next) => {
  return Invite.findOne({
    where: {
      token: req.params.tokenId,
    },
    paranoid: false,
  })
    .then((invite) => {
      if (!invite) {
        // TODO: replace with StatusError
        return res.status(404).send('404 NOT FOUND');
      } else if (invite && invite.deletedAt) {
        return res.status(404).send('Invite Expired/Cancelled');
      }
      return res.redirect(`/signup/${req.params.tokenId}`);
    })
    .catch(next);
});

// below route is sequelize
rootRouter.get('/reset/:tokenId', (req, res, next) => {
  return PasswordReset.findOne({ where: { token: req.params.tokenId } })
    .then((reset) => {
      if (!reset) {
        // TODO: replace with StatusError
        res.status(404).send();
      } else {
        res.redirect(`/resetpassword/${req.params.tokenId}`);
      }
    })
    .catch(next);
});

// TODO: this should be on my router...
rootRouter.get('/unsubscribe/:patientId', async (req, res, next) => {
  try {
    const regUuidTest = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    let patientId = req.params.patientId;

    if (!regUuidTest.test(patientId)) {
      patientId = Buffer.from(patientId, 'base64').toString('utf8');
    }

    const patient = await Patient.findOne({ where: { id: patientId } });

    const preferences = Object.assign({}, patient.preferences);
    preferences.reminders = false;

    await patient.update({ preferences });

    let account = await Account.findOne({
      where: {
        id: patient.accountId,
      },
    });

    let fullLogoUrl = account.fullLogoUrl;

    if (account.fullLogoUrl) {
      fullLogoUrl = fullLogoUrl.replace('[size]', 'original');
    }

    account = account.get({ plain: true });

    delete account.address.id;

    let params = {
      name: account.name,
      address: account.address,
      facebookUrl: account.facebookUrl,
      phoneNumber: account.phoneNumber,
      email: account.contactEmail,
      fullLogoUrl,
    };

    params = JSON.stringify(params);

    params = new Buffer(params).toString('base64');

    return res.redirect(url.format({
      pathname: '/unsubscribe/',
      query: {
        params,
      },
    }));
  } catch (err) {
    next(err);
  }
});


rootRouter.post('/userCheck', (req, res, next) => {
  const username = req.body.email.toLowerCase().trim();
  User.findOne({ where: { username } })
    .then((user) => {
      res.send({ exists: !!user });
    })
    .catch(next);
});

rootRouter.get('/break', async (req, res, next) => {
  throw new Error('Break this process');
});

// All other traffic, just render app
// TODO: Need to update client-side router to handle this
rootRouter.get('(/*)?', (req, res, next) => {
  // TODO: this should be wrapped in a try catch
  return res.render('app');
});

module.exports = rootRouter;
