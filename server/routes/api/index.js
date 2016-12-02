/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const apiRouter = require('express').Router();
const db = require('../../config/db');
import axios from 'axios';
import {vendastaApiKey} from '../../../config.json'

const MAX_RESULTS = 100;

apiRouter.get('/availabilities', (req, res, next) => {
  console.log('GET availabilities');
  db.getAvailabilities(MAX_RESULTS, (err, results) => {
    if (err) next(err);
    res.send(results);
  });
});

apiRouter.get('/reputation', (req, res, next) => {
  console.log('GET reputation');
  axios.post('https://reputation-intelligence-api.vendasta.com/api/v2/listing/getStats/?apiKey=' + vendastaApiKey + '&apiUser=CARU', {
      customerIdentifier: req.params.cust_id || "UNIQUE_CUSTOMER_IDENTIFIER"
    })
    .then(function (response) {
      return res.send(response.data);
    })
    .catch(function (error) {
      return res.sendStatus(404)
    });
})

module.exports = apiRouter;
