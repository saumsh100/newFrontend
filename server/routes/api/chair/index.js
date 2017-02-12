
const chairsRouter = require('express').Router();
const Chair = require('../../../models/Chair');
const normalize = require('../normalize');

chairsRouter.get('/', (req, res, next) => {
  return Chair.run()
    .then(chairs => res.send(normalize('chairs', chairs)))
    .catch(next);
});

chairsRouter.post('/', (req, res, next) => {
  return Chair.save(req.body)
    .then(chair => res.send(normalize('chair', chair)))
    .catch(next);
});

chairsRouter.get('/:chairId', (req, res, next) => {
  const { chairId } = req.params;
  Chair.get(chairId).run()
    .then(chair => res.send(normalize('chair', chair)))
    .catch(next);
});

chairsRouter.put('/:chairId', (req, res, next) => {
  const { chairId } = req.params;
  return Chair.get(chairId).run().then(c =>
    c.merge(req.body).save()
  )
    .then((chair) => {
      res.send(normalize('chair', chair));
    })
    .catch(next);
});

chairsRouter.delete('/:chairId', (req, res, next) => {
  const { chairId } = req.params;
  return Chair.get(chairId).then(chair =>
    chair.delete()
  )
    .then((result) => {
      res.send();
    })
    .catch(next);
});

module.exports = chairsRouter;
