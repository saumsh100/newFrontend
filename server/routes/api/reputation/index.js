
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

const fetchListingsData = (account) => {
  const listingsUrl = `${VENDASTA_LISTINGS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(listingsUrl, { customerIdentifier: account.vendastaId });
};

const fetchReviewsData = (account) => {
  const reviewsUrl = `${VENDASTA_REVIEWS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(reviewsUrl, { customerIdentifier: account.vendastaId });
};

reputationRouter.get('/listings', checkPermission('listings:read'), (req, res, next) => {
  return Account.get(req.accountId).then((account) => {
    fetchListingsData(account)
      .then(response => res.send(response.data))
      .catch(error => next(error));
  }).catch(error => next(error));
});

reputationRouter.get('/reviews', checkPermission('reviews:read'), (req, res, next) => {
  return Account.get(req.accountId).then((account) => {
    fetchReviewsData(account)
      .then(response => res.send(response.data))
      .catch(error => next(error));
  }).catch(error => next(error));
});

module.exports = reputationRouter;
