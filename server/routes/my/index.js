const myRouter = require('express').Router();
const practitionersRouter = require('../api/practitioners');
const servicesRouter = require('../api/services');
const availabilitiesRouter = require('../api/availabilities');
const requestRouter = require('../api/request');
const patientsRouter = require('../api/patients');
const reservationsRouter = require('../api/reservations');
const Account = require('../../models/Account');
const loaders = require('../util/loaders');
const createJoinObject = require('../../middleware/createJoinObject');

myRouter.use('/practitioners', practitionersRouter);
myRouter.use('/services', servicesRouter);
myRouter.use('/availabilities', availabilitiesRouter);
myRouter.use('/requests', requestRouter);
myRouter.use('/patients', patientsRouter);
myRouter.use('/reservations', reservationsRouter);

myRouter.param('accountId', loaders('account', 'Account'));

myRouter.get('/embeds/:accountId', (req, res, next) => {
  try {
    return res.render('patient', { account: req.account });
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
	Account.get(accountId).run().then(account => {
		const { logo, address, clinicName, bookingWidgetPrimaryColor } = account;
		res.send({ logo, address, clinicName, bookingWidgetPrimaryColor });
	})
});

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
myRouter.use('(/*)?', (req, res, next) => {
  return res.status(404).end();
});

module.exports = myRouter;
