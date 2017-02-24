
const servicesRouter = require('express').Router();
const Service = require('../../../models/Service');
const normalize = require('../normalize');
const _ = require('lodash');

servicesRouter.get('/', (req, res, next) => {
  // TODO: add query to filter({  }) !!!
  if (req.query.practitionerId) {
    return Service.run()
      .then((services) => {
        console.log(services);
        const filteredByPractitionerId = services.filter(s =>
          _.includes(s.practitioners, req.query.practitionerId)
        );

        res.send(normalize('services', services));
      });
    // return;
  }

  Service.run()
    .then(services => res.send(normalize(services, arrayOf(services))))
    .catch(next);
});

servicesRouter.post('/', (req, res, next) => {
  // console.log(assign({ id: uuid() }, req.body));
  Service.save(assign({ id: uuid() }, req.body))
  .then(service => res.send(normalize(service, servicesSchema)))
  .catch(next);
});

servicesRouter.get('/:serviceId', (req, res, next) => {
  const { serviceId } = req.params;
  Service.get(serviceId).run()
    .then(service => res.send(normalize(service, servicesSchema)))
    .catch(next);
});

servicesRouter.put('/:serviceId', (req, res, next) => {
  const { serviceId } = req.params;
  Service.get(serviceId).then(s =>
    s.merge(req.body).save()
  )
  .then((service) => {
    res.send(normalize(service, servicesSchema));
  })
  .catch(next);
});

servicesRouter.delete('/:serviceId', (req, res, next) => {
  const { chairId } = req.params;
  Service.get(chairId).then(chair =>
    chair.delete()
  )
  .then((result) => {
    res.send(normalize(result, servicesSchema));
  })
  .catch(next);
});

module.exports = servicesRouter;
