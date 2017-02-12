
const practitionersRouter = require('express').Router();
const Practitioner = require('../../../models/Practitioner');
const normalize = require('../normalize');

practitionersRouter.get('/', (req, res, next) => {
  return Practitioner.run()
    .then(practitioners => res.send(normalize('practitioners', practitioners)))
    .catch(next);
});

practitionersRouter.post('/', (req, res, next) => {
  return Practitioner.save(req.body)
    .then(practitioner => res.send(normalize('practitioner', practitioner)))
    .catch(next);
});

practitionersRouter.get('/:practitionerId', (req, res, next) => {
  const { practitionerId } = req.params;
  return Practitioner.get(practitionerId).execute()
    .then(practitioner => res.send(normalize('practitioner', practitioner)))
    .catch(next);
});

practitionersRouter.put('/:practitionerId', (req, res, next) => {
  const { practitionerId } = req.params;
  return Practitioner.get(practitionerId).then(p =>
    p.merge(req.body).save()
  )
    .then((practitioner) => {
      res.send(normalize('practitioner', practitioner));
    })
    .catch(next);
});

practitionersRouter.delete('/:practitionerId', (req, res, next) => {
  const { practitionerId } = req.params;
  return Practitioner.get(practitionerId).then(practitioner =>
    practitioner.delete()
  )
    .then((result) => {
      res.send();
    })
    .catch(next);
});

module.exports = practitionersRouter;
