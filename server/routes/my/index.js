const myRouter = require('express').Router();
const practitionersRouter = require('../api/practitioners');
const servicesRouter = require('../api/services');
const availabilitiesRouter = require('../api/availabilities');
const requestRouter = require('../api/request');
const patientsRouter = require('../api/patients');

const Account = require('../../models/Account');

const loaders = require('../util/loaders');
const createJoinObject = require('../../middleware/createJoinObject');

myRouter.use('/practitioners', practitionersRouter);
myRouter.use('/services', servicesRouter);
myRouter.use('/availabilities', availabilitiesRouter);
myRouter.use('/requests', requestRouter);
myRouter.use('/patients', patientsRouter);

myRouter.get('/:accountId', (req, res, next) => {
  console.log(req.params.accountId);
  return res.render('patient', {
    accountId: req.params.accountId,
  });
});

// myRouter.param('accountId', loaders('account', 'Account'));

myRouter.get('/widgets/:accountId', (req, res, next) => {

  return res.render('widget', {
    accountId: req.params.accountId,
  });
});

myRouter.get('/logo/:accountId', (req, res, next) => {
	const { accountId } = req.params;
	Account.get(accountId).run().then(account => {
		const { logo, address, clinicName } = account;
		res.send({ logo, address, clinicName });
	})	
});

module.exports = myRouter;
