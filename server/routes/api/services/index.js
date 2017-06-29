
const servicesRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const Service = require('../../../models/Service');
const normalize = require('../normalize');
const _ = require('lodash');
const loaders = require('../../util/loaders');

servicesRouter.param('serviceId', loaders('service', 'Service'));

servicesRouter.get('/', /*checkPermissions('services:read'),*/ (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  if (req.query.practitionerId) {
    return Service.run()
      .then((services) => {
        const filteredByPractitionerId = services.filter(s =>
          _.includes(s.practitioners, req.query.practitionerId)
        );
        res.send(normalize('services', services));
      });
  }

  Service.filter({ accountId }).getJoin(joinObject).run()
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
    .then(service => res.send(normalize('service', service)))
    .catch(next);
});

servicesRouter.put('/:serviceId', checkPermissions('services:update'), (req, res, next) => {

  if (req.service.isDefault !== req.body.isDefault && req.body.isDefault === true) {
    return Service.filter({ accountId: req.service.accountId })
    .getJoin({ practitioners: true }).run()
    .then((services) => {
      const promises = [];
      for (let i = 0; i < services.length; i++) {
        const merge = (services[i].id === req.service.id ? req.body : { isDefault: false });
        promises.push(services[i].merge(merge).saveAll({ practitioners: true }));
      }
      return Promise.all(promises)
      .then((allServices) => {
        res.send(normalize('services', allServices));
      });
    });
  }

  return Service.get(req.service.id).getJoin({ practitioners: true }).run()
    .then((service) => {
      service.merge(req.body).saveAll({ practitioners: true })
        .then((servicePractitioners) => {
          res.send(normalize('service', servicePractitioners));
        }).catch(next);
    });
});

servicesRouter.delete('/:serviceId', checkPermissions('services:delete'), (req, res, next) => {
  return req.service.delete()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = servicesRouter;
