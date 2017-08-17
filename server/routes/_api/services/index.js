import { Service, Practitioner, Practitioner_Service } from '../../../_models';

const servicesRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const { sequelizeLoader } = require('../../util/loaders');

servicesRouter.param('serviceId', sequelizeLoader('service', 'Service'));

servicesRouter.get('/', /*checkPermissions('services:read'),*/ (req, res, next) => {
  const {
    accountId,
    joinObject,
    includeArray,
  } = req;

  Service.findAll({
    where: { accountId },
    include: includeArray,
  }).then((services) => {
    services = services.map(service => service.get({ plain: true }));
    return res.send(normalize('services', services));
  })
    .catch(next);
});

servicesRouter.post('/', checkPermissions('services:create'), (req, res, next) => {
  const serviceData = Object.assign({}, req.body, {
    accountId: req.accountId,
  });
  return Service.create(serviceData)
    .then(service => res.status(201).send(normalize('service', service.get({ plain: true }))))
    .catch(next);
});

servicesRouter.get('/:serviceId', (req, res, next) => {
  Promise.resolve(req.service)
    .then(service => res.send(normalize('service', service.get({ plain: true }))))
    .catch(next);
});

servicesRouter.put('/:serviceId', checkPermissions('services:update'), async (req, res, next) => {
  // [ { model: Practitioner, as: 'practitioners' } ]
  try {

    if (req.body.practitioners && Array.isArray(req.body.practitioners)) {
      const service = await Service.findOne({
        where: {
          id: req.service.id,
        },
        include: [{ model: Practitioner, as: 'practitioners', required: false }],
      });
      const serviceClean = service.get({ plain: true });
      const practitioners = serviceClean.practitioners;

      // delete removed services
      for (let i = 0; i < practitioners.length; i++) {
        if (!req.body.practitioners.includes(practitioners[i])) {
          await Practitioner_Service.destroy({
            where: {
              practitionerId: practitioners[i],
              serviceId: serviceClean.id,
            },
          });
        }
      }

      // create new services for pract
      for (let i = 0; i < req.body.practitioners.length; i++) {
        if (!practitioners.includes(req.body.practitioners[i])) {
          await Practitioner_Service.create({
            practitionerId: req.body.practitioners[i],
            serviceId: serviceClean.id,
          });
        }
      }
    }

    if (req.service.isDefault !== req.body.isDefault && req.body.isDefault === true) {
      await Service.update({ isDefault: false }, {
        where: { accountId: req.accountId },
      });

      await Service.update(req.body, {
        where: {
          id: req.service.id,
        },
      });

      return Service.findAll({
        where: { accountId: req.accountId },
        include: [{ model: Practitioner, as: 'practitioners', required: false }],
      }).then((services) => {
        const allServices = services.map(service => service.get({ plain: true }));
        return res.send(normalize('services', allServices));
      });
    }

    await Service.update(req.body, {
      where: {
        id: req.service.id,
      },
    });

    return Service.findOne({
      where: {
        id: req.service.id,
      },
      include: [{ model: Practitioner, as: 'practitioners', required: false }],
    }).then(service => res.send(normalize('service', service.get({ plain: true }))))
  } catch (error) {
    next(error);
  }
});

servicesRouter.delete('/:serviceId', checkPermissions('services:delete'), (req, res, next) => {
  return req.service.destroy()
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = servicesRouter;
