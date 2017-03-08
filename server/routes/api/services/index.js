
const servicesRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const Service = require('../../../models/Service');
const normalize = require('../normalize');
const _ = require('lodash');
const loaders = require('../../util/loaders');

servicesRouter.param('serviceId', loaders('service', 'Service'));


servicesRouter.get('/', checkPermissions('services:read'), (req, res, next) => {
  if (req.query.practitionerId) {
    return Service.run()
      .then((services) => {
        const filteredByPractitionerId = services.filter(s =>
          _.includes(s.practitioners, req.query.practitionerId)
        );
        res.send(normalize('services', services));
      });
    
  }
  Service.run()
    .then(services => res.send(normalize('services', services)))
    .catch(next);
});

servicesRouter.post('/', checkPermissions('services:create'), (req, res, next) => {
  const serviceData = Object.assign({}, req.body, {
    accountId: req.accountId,
  });

  return Service.save(serviceData)
    .then(service => res.status(201).send(normalize('service', service)))
    .catch(next);
});

servicesRouter.get('/:serviceId', (req, res, next) => {
  const { serviceId } = req.params;
  Service.get(serviceId).run()
    .then(service => res.send(normalize(service, servicesSchema)))
    .catch(next);
});

servicesRouter.put('/:serviceId', checkPermissions('services:update'), (req, res, next) => {
  return req.service.merge(req.body).save()
    .then(service => res.send(normalize('service', service)))
    .catch(next);
});

servicesRouter.delete('/:serviceId',checkPermissions('services:delete'), (req, res, next) => {
  return req.service.delete()
    .then(() => {
      res.send(204);
    })
    .catch(next);
});

module.exports = servicesRouter;
