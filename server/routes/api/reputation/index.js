const reputationRouter = require('express').Router();
const axios = require('axios');
const checkPermission = require('../../../middleware/checkPermissions');
const globals = require('../../../config/globals');
const Account = require('../../../models/Account');

const VENDASTA_LISTINGS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/listing/getStats/';
const VENDASTA_REVIEWS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/review/getStats/';
const {
  apiKey,
  apiUser,
} = globals.vendasta;

reputationRouter.get('/listings', checkPermission('listings:read'), (req, res, next) => {
  console.log(req.token);
  return Account.get(req.token.activeAccountId).then((account) => {
    axios.post(`${VENDASTA_LISTINGS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`, {
      customerIdentifier: account.vendastaId,
    }).then((response) => {
      return res.send(response.data);
    }).catch((error) => {
      return next(error);
    });
  }).catch((error) => {
    error.status = 404;
    return next(error);
  });
});


reputationRouter.get('/reviews', checkPermission('reviews:read'), (req, res, next) => {
  return Account.get(req.token.activeAccountId).then((account) => {
    axios.post(`${VENDASTA_REVIEWS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`, {
      customerIdentifier: account.vendastaId,
    }).then((response) => {
      return res.send(response.data);
    }).catch((error) => {
      return next(error);
    });
  }).catch(error => next(error));
});

module.exports = reputationRouter;