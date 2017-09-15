import { Account } from '../../../_models';
import moment from 'moment';

const reputationRouter = require('express').Router();
const axios = require('axios');
const checkPermission = require('../../../middleware/checkPermissions');
const globals = require('../../../config/globals');

const VENDASTA_LISTINGS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/listing/getStats/';
const VENDASTA_LISTINGS_ACCOUNT = 'https://reputation-intelligence-api.vendasta.com/api/v2/account/get/';
const VENDASTA_LISTINGS_SEARCH = 'https://reputation-intelligence-api.vendasta.com/api/v2/listing/lookupListings/';

const VENDASTA_REVIEWS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/review/getStats/';
const VENDASTA_REVIEWS_LOOKUP = 'https://reputation-intelligence-api.vendasta.com/api/v3/review/search/';

const {
  apiKey,
  apiUser,
} = globals.vendasta;

const fetchListingsData = (account) => {
  console.log(account.vendastaAccountId)
  console.log(account.vendastaId);
  const listingsUrl = `${VENDASTA_LISTINGS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(listingsUrl, { customerIdentifier: account.vendastaId });
};

const fetchListingsInfo = (account) => {
  const listingsUrl = `${VENDASTA_LISTINGS_ACCOUNT}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(listingsUrl, { customerIdentifier: account.vendastaId });
};

const fetchListingsSearch = (account) => {
  const listingsUrl = `${VENDASTA_LISTINGS_SEARCH}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(listingsUrl, { customerIdentifier: account.vendastaId });
};

const fetchReviewsData = (account) => {
  const reviewsUrl = `${VENDASTA_REVIEWS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(reviewsUrl, { customerIdentifier: account.vendastaId });
};

const fetchReviewsLookup = (account, minDateTime, maxDateTime) => {
  console.log(account.vendastaId)
  const reviewsUrl = `${VENDASTA_REVIEWS_LOOKUP}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(reviewsUrl, { customerIdentifier: account.vendastaId, minDateTime, maxDateTime });
};

reputationRouter.get('/listings', checkPermission('listings:read'), (req, res, next) => {
  return Account.findById(req.accountId).then((accountModel) => {
    const account = accountModel.get({ plain: true });
    fetchListingsData(account)
      .then((respData) => {
        fetchListingsInfo(account)
        .then((respInfo) => {
          fetchListingsSearch(account)
           .then((respSearch) => {
             respSearch.data.accountInfo = respInfo.data.data;
             respSearch.data.searchData = respSearch.data.data;
             respSearch.data.data = respData.data.data;
             return res.send(respSearch.data);
           });
        });
      }).catch((e) =>  {
      return res.sendStatus(400);
    });
  }).catch(error => next(error));
});

reputationRouter.get('/reviews', checkPermission('reviews:read'), (req, res, next) => {
  const {
    startDate = moment().subtract(180, 'days')._d,
    endDate = moment()._d
  } = req.query;

  return Account.findById(req.accountId).then((accountModel) => {
    const account = accountModel.get({ plain: true });
    fetchReviewsLookup(account, moment(startDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]'), moment(endDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]'))
    .then((resp) => {
      fetchReviewsData(account)
        .then((response) => {
          response.data.reviews = resp.data.data;
          return res.send(response.data);
        })
    }).catch((e) => {
      return res.sendStatus(404);
    });
  }).catch(error => next(error));
});

module.exports = reputationRouter;
