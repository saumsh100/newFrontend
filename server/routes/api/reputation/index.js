const reputationRouter = require('express').Router();
const axios = require('axios');

const globals = require('../../../config/globals');

const VENDASTA_LISTINGS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/listing/getStats/';
const VENDASTA_REVIEWS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/review/getStats/';
const {
  apiKey,
  apiUser,
} = globals.vendasta;

reputationRouter.get('/listings', (req, res, next) => {
  console.log(req.user)
  axios.post(`${VENDASTA_LISTINGS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`, {
    customerIdentifier: req.params.cust_id || 'UNIQUE_CUSTOMER_IDENTIFIER',
  }).then((response) => {
    return res.send(response.data);
  }).catch((error) => {
    return next(error);
  });
});


reputationRouter.get('/reviews', (req, res, next) => {
  
  axios.post(`${VENDASTA_REVIEWS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`, {
    customerIdentifier: req.params.cust_id || 'UNIQUE_CUSTOMER_IDENTIFIER',
  }).then((response) => {
    return res.send(response.data);
  }).catch((error) => {
    return next(error);
  });
});

module.exports = reputationRouter;