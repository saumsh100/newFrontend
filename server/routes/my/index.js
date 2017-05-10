
const myRouter = require('express').Router();
const newAvailabilitiesRouter = require('./newAvailabilitiesRouter');
const requestRouter = require('../api/request');
const reservationsRouter = require('../api/reservations');
const Account = require('../../models/Account');
const Patient = require('../../models/Patient');
const loaders = require('../util/loaders');
const createJoinObject = require('../../middleware/createJoinObject');
const normalize = require('../api/normalize');

myRouter.use('/', newAvailabilitiesRouter);
myRouter.use('/requests', requestRouter);
myRouter.use('/reservations', reservationsRouter);

myRouter.param('accountId', loaders('account', 'Account'));
myRouter.param('patientId', loaders('patient', 'Patient'));
myRouter.param('accountIdJoin', loaders('account', 'Account', { services: true, practitioners: true }));

myRouter.get('/embeds/:accountIdJoin', (req, res, next) => {
  try {
    // Needs to match the structure of the reducers
    const { entities } = normalize('account', req.account);
    const initialState = {
      availabilities: {
        account: req.account,
        services: req.account.services,
        practitioners: req.account.practitioners,
        selectedServiceId: req.account.services[0].id,
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

myRouter.get('/widgets/:accountId', (req, res, next) => {
  try {
    return res.render('widget', {
      host: `${req.protocol}://${req.headers.host}`,
      account: req.account,
    });
  } catch (err) {
    next(err);
  }
});

myRouter.get('/logo/:accountId', (req, res, next) => {
	const { accountId } = req.params;
	return Account.get(accountId).run().then(account => {
		const { logo, address, clinicName, bookingWidgetPrimaryColor } = account;
		res.send({ logo, address, clinicName, bookingWidgetPrimaryColor });
	});
});

myRouter.post('/patientCheck', (req, res, next) => {
  const email = req.body.email.toLowerCase();
  return Patient.filter({ email }).run()
    .then(p => res.send({ exists: !!p[0] }))
    .catch(next);
});

myRouter.post('/patients', (req, res, next) => {
  return Patient.save(req.body)
    .then(patient => res.status(201).send(normalize('patient', patient)))
    .catch(next);
});

myRouter.post('/patients/:patientId/confirm', (req, res, next) => {
  const { confirmCode } = req.body;
  try {
    if (confirmCode !== '8888') {
      res.status(400).send('Invalid confirmation code');
    }

    res.send(req.patient);
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
