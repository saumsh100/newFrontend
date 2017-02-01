const { normalize, Schema, arrayOf } = require('normalizr');
const _ = require('lodash');
const servicesRouter = require('express').Router();
const Service = require('../../../models/Service');

const servicesSchema = new Schema('services');


servicesRouter.get('/', (req, res, next) => {
  if (req.query.practitionerId) {
    Service.run()
      .then((services) => {
        const filteredByPractitionerId = services.filter(s =>
          _.includes(s.practitioners, req.query.practitionerId)
        );
        return res.send(normalize(filteredByPractitionerId, arrayOf(servicesSchema)));
      });
    return;
  }
  Service.run()
    .then(services => res.send(normalize(services, arrayOf(servicesSchema))))
    .catch(next);
});

module.exports = servicesRouter;
