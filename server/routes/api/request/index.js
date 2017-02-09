
const { normalize, Schema, arrayOf } = require('normalizr');
const requestsRouter = require('express').Router();
const Request = require('../../../models/Request');

const requestSchema = new Schema('requests');

requestsRouter.get('/', (req, res, next) => {
  Request.filter({
  }).getJoin({
    patient: true,
    practitioner: {services: false},
    service: {practitioners: false},
    chair: true,
  }).run()
    .then(requests => res.send(normalize(requests, arrayOf(requestSchema))))
    .catch(next);
});

module.exports = requestsRouter;
