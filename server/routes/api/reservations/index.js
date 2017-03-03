
const reservationsRouter = require('express').Router();
const loaders = require('../../util/loaders');
const Reservation = require('../../../models/Reservation');
const Service = require('../../../models/Service');
const normalize = require('../normalize');
const moment = require('moment');

reservationsRouter.get('/', (req, res, next) => {
  const accountId = req.query.accountId || req.accountId;
  const { practitionerId } = req.body;
  return Reservation.filter({ practitionerId }).run()
    .then(reservations => res.send(normalize('reservations', reservations)))
    .catch(next);
});


reservationsRouter.post('/', (req, res, next) => {
  const accountId = req.query.accountId || req.accountId;
  const { practitionerId, serviceId, startsAt } = req.body;
  console.log("reservation")
  console.log("reg.body")
  console.log(req.body)
  Service.get(serviceId).run().then((service) => {
  	const endTime = moment(startsAt).add(service.duraction, 'minutes')._d; 
	  console.log("endTime");
	  console.log(endTime);
	  return Reservation.save({
			practitionerId,
			serviceId,
			startTime: startsAt,
			endTime,
			accountId,  	
	  }).then(reservation => res.send(normalize('reservations', reservation)))
	    .catch(next);
  })
});

module.exports = reservationsRouter;