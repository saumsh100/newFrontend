
const availabilitiesRouter = require('express').Router();
const isEmpty = require('lodash/isEmpty');
const Service = require('../../models/Service');
const Practitioner = require('../../models/Practitioner');
const StatusError = require('../../util/StatusError');
const loaders = require('../util/loaders');

availabilitiesRouter.param('accountId', loaders('account', 'Account'));

availabilitiesRouter.get('/accounts/:accountId/availabilities', (req, res, next) => {
  const {
    serviceId,
    practitionerId,
    startDate,
    endDate,
  } = req.query;

  return fetchServiceWithPractitioners({ accountId: req.account.id, serviceId, practitionerId })
    .then((service) => {
      const { practitioners } = service;

      // Get open time slots from practitioners between startDate endDate

      return res.send(practitioners);
    })
    .catch(next);
});

function fetchServiceWithPractitioners({ accountId, serviceId, practitionerId }) {
  // Wrap in a promise so that we can reject if certain conditions are not met (account does not own service)
  return new Promise((resolve, reject) => {
    return Service.get(serviceId).getJoin({ practitioners: true })
      .then((service) => {
        if (service.accountId !== accountId) {
          return reject(StatusError(403, `This account does not have access to service with id: ${serviceId}`));
        }

        if (isEmpty(service.practitioners)) {
          return reject(StatusError(400, `Service with id: ${serviceId} has no practitioners.`));
        }

        if (!practitionerId) {
          // default to returning all practitioners that can perform this service
          return resolve(service);
        }

        const practitioners = service.practitioners.filter((practitioner) => practitioner.id === practitionerId);
        if (isEmpty(practitioners)) {
          return reject(StatusError(400, `Service has no practitioners with id: ${practitionerId}`));
        }

        service.practitioners = practitioners;
        return resolve(service);
      });
  });
}

module.exports = availabilitiesRouter;
