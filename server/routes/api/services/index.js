const { normalize, Schema, arrayOf } = require('normalizr');
const servicesRouter = require('express').Router();
const Service = require('../../../models/Service');
const uuid = require('uuid').v4;
const assign = require('lodash/assign');

const servicesSchema = new Schema('servicesSchema');

servicesRouter.get('/', (req, res, next) => {
  Service.getJoin({ practitioners: true })
    .then(services => res.send(normalize(services, arrayOf(servicesSchema))))
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
