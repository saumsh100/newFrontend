
const { normalize, Schema, arrayOf } = require('normalizr');
const availabilitiesRouter = require('express').Router();
const Appointment = require('../../../models/Appointment');
import moment from 'moment';

availabilitiesRouter.get('/', (req, res, next) => {
  const { serviceId, practitionerId, startDate, endDate } = req.query;
  Appointment.filter({ practitionerId }).getJoin().run().then((appointments) => {
    res.send(appointments);
  });
});

module.exports = availabilitiesRouter;
