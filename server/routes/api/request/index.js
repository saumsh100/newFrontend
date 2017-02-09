
const requestsRouter = require('express').Router();
const normalize = require('../normalize');
const Request = require('../../../models/Request');

requestsRouter.get('/', (req, res, next) => {
  return Request.filter({

  }).getJoin({
    patient: true,
    practitioner: { services: false },
    service: { practitioners: false },
    chair: true,
  }).run()
    .then(requests => res.send(normalize('requests', requests)))
    .catch(next);
});

module.exports = requestsRouter;
