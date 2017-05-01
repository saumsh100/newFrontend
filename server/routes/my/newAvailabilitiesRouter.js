
const availabilitiesRouter = require('express').Router();
//const isEmpty = require('lodash/isEmpty');
// const { r } = require('../../config/thinky');
// const Service = require('../../models/Service');
// const Practitioner = require('../../models/Practitioner');
// const StatusError = require('../../util/StatusError');
const { fetchServiceData, fetchPractitionerData } = require('../../lib/availabilities');
const loaders = require('../util/loaders');

availabilitiesRouter.param('accountId', loaders('account', 'Account'));

availabilitiesRouter.get('/accounts/:accountId/availabilities', (req, res, next) => {
  const {
    serviceId,
    practitionerId,
    startDate,
    endDate,
  } = req.query;

  return fetchServiceData({ accountId: req.account.id, serviceId, practitionerId })
    .then((service) => {
      const { practitioners } = service;

      // Get open time slots from practitioners between startDate endDate
      fetchPractitionerData(practitioners, startDate, endDate)
        .then((data) => {

          // Get any applicable time Off for the practitioners
          /*fetchPractitionersTimeOff(practitioners, startDate, endDate)
            .then((timeOff) => {
              return res.send({ weeklySchedules, timeOff });
            });*/


        });
    })
    .catch(next);
});

module.exports = availabilitiesRouter;
