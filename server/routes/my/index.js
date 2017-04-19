
const myRouter = require('express').Router();
const practitionersRouter = require('../api/practitioners');
const servicesRouter = require('../api/services');
const availabilitiesRouter = require('../api/availabilities');
const newAvailabilitiesRouter = require('./newAvailabilitiesRouter');
const requestRouter = require('../api/request');
const patientsRouter = require('../api/patients');
const reservationsRouter = require('../api/reservations');
const Account = require('../../models/Account');
const loaders = require('../util/loaders');
const createJoinObject = require('../../middleware/createJoinObject');

myRouter.use('/', newAvailabilitiesRouter);
myRouter.use('/practitioners', practitionersRouter);
myRouter.use('/services', servicesRouter);
myRouter.use('/availabilities', availabilitiesRouter);
myRouter.use('/requests', requestRouter);
myRouter.use('/patients', patientsRouter);
myRouter.use('/reservations', reservationsRouter);

myRouter.param('accountId', loaders('account', 'Account'));
myRouter.param('accountIdJoin', loaders('account', 'Account', { services: true, practitioners: true }));

myRouter.get('/embeds/:accountIdJoin', (req, res, next) => {
  try {
    // Needs to match the structure of the reducers
    const initialState = {
      availabilities: {
        account: req.account,
        services: req.account.services,
        practitioners: req.account.practitioners,
      },
    };

    console.log(JSON.stringify(initialState));
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

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
myRouter.use('(/*)?', (req, res, next) => {
  return res.status(404).end();
});

module.exports = myRouter;
