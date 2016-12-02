/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const apiRouter = require('express').Router();
const db = require('../../config/db');
const axios = require('axios');
const globals = require('../../config/globals');

const MAX_RESULTS = 100;

apiRouter.get('/availabilities', (req, res, next) => {
  db.getAvailabilities(MAX_RESULTS, (err, results) => {
    if (err) next(err);
    res.send(results);
  });
});

const VENDASTA_LISTINGS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/listing/getStats/';
const {
  apiKey,
  apiUser,
} = globals.vendasta;

apiRouter.get('/reputation', (req, res, next) => {
  
  console.log('apiKey', apiKey);
  console.log('apiUser', apiUser);
  axios.post(`${VENDASTA_LISTINGS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`, {
    customerIdentifier: req.params.cust_id || 'UNIQUE_CUSTOMER_IDENTIFIER',
  }).then((response) => {
    return res.send(response.data);
  }).catch((error) => {
    return res.sendStatus(404);
  });
});

module.exports = apiRouter;
