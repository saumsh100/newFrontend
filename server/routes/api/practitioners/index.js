const { normalize, Schema, arrayOf } = require('normalizr');
const practitionersRouter = require('express').Router();
const Practitioner = require('../../../models/Practitioner');
const uuid = require('uuid').v4;
const assign = require('lodash/assign');

const practitionerSchema = new Schema('practitionerSchema');

practitionersRouter.get('/', (req, res, next) => {
  Practitioner.getJoin({ services: true }).run()
    .then(practitioners => res.send(normalize(practitioners, arrayOf(practitionerSchema))))
    .catch(next);
});

practitionersRouter.post('/', (req, res, next) => {
  console.log(assign({ id: uuid() }, req.body));
  Practitioner.save(assign({ id: uuid() }, req.body))
  .then(practitioner => res.send(normalize(practitioner, practitionerSchema)))
  .catch(next);
});

practitionersRouter.get('/:practitionerId', (req, res, next) => {
  const { practitionerId } = req.params;
  Practitioner.get(practitionerId).execute()
    .then(practitioner => res.send(normalize(practitioner, practitionerSchema)))
    .catch(next);
});

practitionersRouter.put('/:practitionerId', (req, res, next) => {
  const { practitionerId } = req.params;
  Practitioner.get(practitionerId).run().then(p =>
    p.merge(req.body).save()
  )
  .then((practitioner) => {
    res.send(normalize(practitioner, practitionerSchema));
  })
  .catch(next);
});

practitionersRouter.delete('/:practitionerId', (req, res, next) => {
  const { practitionerId } = req.params;
  Practitioner.get(practitionerId).then(practitioner =>
    practitioner.delete()
  )
  .then((result) => {
    res.send(normalize(result, practitionerSchema));
  })
  .catch(next);
});

module.exports = practitionersRouter;
