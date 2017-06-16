
import authRouter from './auth';
import authMiddleware from '../../middleware/patientAuth';
import { Account, PatientUser } from '../../models';

const myRouter = require('express').Router();
const fs = require('fs');
const newAvailabilitiesRouter = require('./newAvailabilitiesRouter');
const requestRouter = require('../api/request');
const waitSpotsRouter = require('../api/waitSpots');
const reservationsRouter = require('../api/reservations');
const oauthRouter = require('./oauth');

const loaders = require('../util/loaders');
const createJoinObject = require('../../middleware/createJoinObject');
const normalize = require('../api/normalize');

myRouter.use('/', newAvailabilitiesRouter);
myRouter.use('/requests', authMiddleware, requestRouter);
myRouter.use('/waitSpots', authMiddleware, waitSpotsRouter);
myRouter.use('/reservations', reservationsRouter);
myRouter.use('/oauth', oauthRouter);
myRouter.use('/auth', authRouter);

myRouter.param('accountId', loaders('account', 'Account'));
myRouter.param('patientUserId', loaders('patientUser', 'PatientUser'));
myRouter.param('accountIdJoin', loaders('account', 'Account', {
  services: {
    _apply: service => service.filter(row => {
      return row('isHidden').ne(true);
    }),
  },
  practitioners: true,
}));

myRouter.get('/widgets/:accountIdJoin/embed', (req, res, next) => {
  try {
    // Needs to match the structure of the reducers
    const { entities } = normalize('account', req.account);
    const initialState = {
      availabilities: {
        account: req.account,
        services: req.account.services,
        practitioners: req.account.practitioners,
        selectedServiceId: (req.account.services[0] ? req.account.services[0].id : null),
      },

      entities,
    };

    return res.render('patient', {
      account: req.account,
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

myRouter.get('/widgets/:accountId/widget.js', (req, res, next) => {
  try {
    fs.readFile(getPath('widget.js'), 'utf8', (err, widgetJS) => {
      if (err) throw err;
      fs.readFile(getPath('widget.css'), 'utf8', (_err, widgetCSS) => {
        if (_err) throw _err;
        const color = req.account.bookingWidgetPrimaryColor || '#FF715A';
        const iframeSrc = `${req.protocol}://${req.headers.host}/widgets/${req.account.id}/embed`;
        const withColor = replaceIndex(widgetJS, /__REPLACE_THIS_COLOR__/g, 1, toString(color));
        const withSrc = replaceIndex(withColor, /__REPLACE_THIS_IFRAME_SRC__/g, 1, toString(iframeSrc));
        const replacedWidgetJS = replaceIndex(withSrc, /__REPLACE_THIS_STYLE_TEXT__/g, 1, toTemplateString(widgetCSS));

        // TODO: need to be able to minify and compress code UglifyJS
        res.send(replacedWidgetJS);
      });
    });
  } catch (err) {
    next(err);
  }
});

myRouter.post('/patientCheck', (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const phoneNumber = req.body.phoneNumber;
  return PatientUser.filter({ email, phoneNumber }).run()
    .then(p => res.send({ exists: !!p[0] }))
    .catch(next);
});

myRouter.get('/patientUsers/:patientUserId', (req, res, next) => {
  try {
    res.json(req.patientUser.makeSafe());
  } catch (err) {
    next(err);
  }
});

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
myRouter.use('(/*)?', (req, res, next) => {
  return res.status(404).end();
});

module.exports = myRouter;
