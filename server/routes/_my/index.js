/* eslint-disable consistent-return */
import { Router } from 'express';
import fs from 'fs';
import newAvailabilitiesRouter from './newAvailabilitiesRouter';
import requestRouter from '../_api/request';
import waitSpotsRouter from '../_api/waitSpots';
import authRouter from './auth';
import reviewsRouter from './reviews';
import { sequelizeAuthMiddleware } from '../../middleware/patientAuth';
import { PatientUser, Practitioner } from '../../_models';
import { validatePhoneNumber } from '../../util/validators';
import { sequelizeLoader } from '../util/loaders';
import normalize from '../_api/normalize';

const sequelizeMyRouter = Router();

sequelizeMyRouter.use('/', newAvailabilitiesRouter);
sequelizeMyRouter.use('/requests', sequelizeAuthMiddleware, requestRouter);
sequelizeMyRouter.use('/waitSpots', sequelizeAuthMiddleware, waitSpotsRouter);
sequelizeMyRouter.use('/auth', authRouter);

sequelizeMyRouter.param('accountId', sequelizeLoader('account', 'Account'));
sequelizeMyRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));
sequelizeMyRouter.param('accountIdJoin', sequelizeLoader('account', 'Account', [
  { association: 'services', required: false, where: { isHidden: { $ne: true } }, order: [['name', 'ASC']] },
  { association: 'practitioners', required: false, where: { isActive: true } },
]));

sequelizeMyRouter.use('/reviews', reviewsRouter);

sequelizeMyRouter.get('/widgets/:accountIdJoin/embed', async (req, res, next) => {
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

    const initialState = {
      availabilities: {
        account: responseAccount,
        services: responseServices,
        practitioners: responsePractitioners,
        selectedServiceId,
      },

      entities,
    };

    return res.render('patient', {
      account: responseAccount,
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

const toString = str => `"${str}"`;
const toTemplateString = str => `\`${str}\``;
const getPath = filename => `${__dirname}/../../routes/my/${filename}`;

sequelizeMyRouter.get('/widgets/:accountId/widget.js', (req, res, next) => {
  const account = req.account.get({ plain: true });
  try {
    fs.readFile(getPath('widget.js'), 'utf8', (err, widgetJS) => {
      if (err) throw err;
      fs.readFile(getPath('widget.css'), 'utf8', (_err, widgetCSS) => {
        if (_err) throw _err;
        const color = account.bookingWidgetPrimaryColor || '#FF715A';
        const iframeSrc = `${req.protocol}://${req.headers.host}/widgets/${account.id}/embed`;
        const withColor = replaceIndex(widgetJS, /__REPLACE_THIS_COLOR__/g, 1, toString(color));
        const withSrc = replaceIndex(withColor, /__REPLACE_THIS_IFRAME_SRC__/g, 1, toString(iframeSrc));
        const withStyleText = replaceIndex(withSrc, /__REPLACE_THIS_STYLE_TEXT__/g, 1, toTemplateString(widgetCSS));
        const replacedWidgetJS = replaceIndex(withStyleText, /__ACCOUNT_ID__/g, 1, toTemplateString(account.id));

        // TODO: need to be able to minify and compress code UglifyJS
        res.send(replacedWidgetJS);
      });
    });
  } catch (err) {
    next(err);
  }
});

sequelizeMyRouter.post('/patientUsers/email', async (req, res, next) => {
  let {
    email,
  } = req.body;

  email = email && email.toLowerCase();

  try {
    const patientUsers = await PatientUser.findAll({ where: { email } });
    return res.send({ exists: !!patientUsers[0] });
  } catch (error) {
    next(error);
  }
});

sequelizeMyRouter.post('/patientUsers/phoneNumber', async (req, res, next) => {
  let {
    phoneNumber,
  } = req.body;

  phoneNumber = validatePhoneNumber(phoneNumber);
  try {
    const patientUsers = await PatientUser.findAll({ where: { phoneNumber } });
    return res.send({ exists: !!patientUsers[0] });
  } catch (error) {
    next(error);
  }
});


sequelizeMyRouter.get('/patientUsers/:patientUserId', (req, res, next) => {
  const patientUser = req.patientUser.get({ plain: true });
  delete patientUser.password;
  try {
    res.json(patientUser);
  } catch (err) {
    next(err);
  }
});

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
sequelizeMyRouter.use('(/*)?', (req, res, next) => {
  // TODO: this needs to be wrapped in try catch
  return res.status(404).end();
});

module.exports = sequelizeMyRouter;
