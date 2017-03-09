
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
  Service.get(serviceId).run().then((service) => {
  	const endTime = moment(startsAt).add(service.duraction, 'minutes')._d; 
	  return Reservation.save({
			practitionerId,
			serviceId,
			startTime: startsAt,
			endTime,
			accountId,  	
	  }).then(reservation => res.send(normalize('reservation', reservation)))
	    .catch(next);
  })
});

reservationsRouter.delete('/:reservationId', (req, res, next) => {
	const { reservationId } = req.params;	
	Reservation.get(reservationId).then(r => {
		r.delete();
	});
});

module.exports = reservationsRouter;