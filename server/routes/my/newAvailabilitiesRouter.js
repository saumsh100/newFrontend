
const availabilitiesRouter = require('express').Router();
const { fetchAvailabilities } = require('../../lib/availabilities');
const loaders = require('../util/loaders');

availabilitiesRouter.param('accountId', loaders('account', 'Account'));

/**
 * Availabilities API
 */
availabilitiesRouter.get('/accounts/:accountId/availabilities', (req, res, next) => {
  const data = Object.assign({}, req.query, {
    accountId: req.account.id,
  });

  console.log(req.query);

  return fetchAvailabilities(data)
    .then((availabilities) => {
      console.log(availabilities);
      res.send({ availabilities });
    })
    .catch(next);
});

module.exports = availabilitiesRouter;
