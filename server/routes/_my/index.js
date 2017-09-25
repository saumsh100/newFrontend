/* eslint-disable consistent-return */
import { Router } from 'express';
import fs from 'fs';
import StatusError from '../../util/StatusError';
import { lookupsClient } from '../../config/twilio';
import newAvailabilitiesRouter from './newAvailabilitiesRouter';
import requestRouter from '../_api/request';
import waitSpotsRouter from '../_api/waitSpots';
import authRouter from './auth';
import reviewsRouter from './reviews';
import widgetsRouter from './widgets';
import { sequelizeAuthMiddleware } from '../../middleware/patientAuth';
import { Patient, PatientUser, Practitioner, PatientUserReset } from '../../_models';
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
sequelizeMyRouter.use('/widgets', widgetsRouter);

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
const getPath = filename => `${__dirname}/../../routes/_my/${filename}`;

sequelizeMyRouter.get('/widgets/:accountId/widget.js', (req, res, next) => {
  try {
    const account = req.account.get({ plain: true });
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
        res.type('javascript').send(replacedWidgetJS);
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
    const alreadyExists = !!patientUsers[0];
    if (alreadyExists) {
      return res.send({ error: 'There is already a user with that mobile number.' });
    }

    lookupsClient.phoneNumbers(phoneNumber).get({
      type: 'carrier'
    }, function(error, number) {
      if (error) {
        return res.sendStatus(200);
      }

      const isLandline = number && number.carrier && number.carrier.type === 'landline';
      if (isLandline) {
        res.send({ error: 'You cannot use a landline number. Please enter a mobile number.' });
      } else {
        res.sendStatus(200);
      }
    });
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

sequelizeMyRouter.get('/unsubscribe/:encoded', async (req, res, next) => {
  try {
    // TODO: unsubscribe patient preferences
    const { encoded } = req.params;
    const { md_email } = req.query;
    const [email, accountId] = new Buffer(encoded, 'base64').toString('ascii').split(':');

    const patient = await Patient.findOne({ where: { email, accountId } });
    if (!patient) {
      return next(StatusError(404, 'Page not found'));
    }

    if (md_email !== email) {
      console.log(md_email, email);
      return next(StatusError(404, 'Page not found'));
    }

    res.render('unsub', { email, accountId, firstName: patient.firstName });
  } catch (err) {
    next(err);
  }
});

sequelizeMyRouter.get('/reset/:tokenId', (req, res, next) => {
  return PatientUserReset.findOne({ where: { token: req.params.tokenId } })
    .then((reset) => {
      if (!reset) {
        // TODO: replace with StatusError
        res.status(404).send();
      } else {
        res.redirect(`/reset-password/${req.params.tokenId}`);
      }
    })
    .catch(next);
});

sequelizeMyRouter.post('/reset-password/:tokenId', (req, res, next) => {
  const {
    password,
  } = req.body;

  return PatientUserReset.findOne({ where: { token: req.params.tokenId } })
    .then(async (reset) => {
      if (!reset) {
        return next(StatusError(401, 'Invalid Token'));
      }

      const user = await PatientUser.findOne({
        where: {
          id: reset.patientUserId,
        },
      });

      await user.setPasswordAsync(password);
      await user.save();
      await reset.destroy();
      return res.sendStatus(201);
    })
    .catch(next);
});

sequelizeMyRouter.get('(/*)?', (req, res, next) => {
  try {
    return res.render('my');
  } catch (err) {
    next(err);
  }
});

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
/*sequelizeMyRouter.use('(/*)?', (req, res, next) => {
  // TODO: this needs to be wrapped in try catch
  return res.status(404).end();
});*/

module.exports = sequelizeMyRouter;
