const { normalize, Schema, arrayOf } = require('normalizr');
const chairsRouter = require('express').Router();
const Chair = require('../../../models/Chair');
const uuid = require('uuid').v4;
const assign = require('lodash/assign');

const chairsSchema = new Schema('chairsSchema');

chairsRouter.get('/', (req, res, next) => {
  Chair.run()
    .then(chairs => res.send(normalize(chairs, arrayOf(chairsSchema))))
    .catch(next);
});

chairsRouter.post('/', (req, res, next) => {
  // console.log(assign({ id: uuid() }, req.body));
  Chair.save(assign({ id: uuid() }, req.body))
  .then(chair => res.send(normalize(chair, chairsSchema)))
  .catch(next);
});

chairsRouter.get('/:chairId', (req, res, next) => {
  const { chairId } = req.params;
  Chair.get(chairId).run()
    .then(chair => res.send(normalize(chair, chairsSchema)))
    .catch(next);
});

chairsRouter.put('/:chairId', (req, res, next) => {
  const { chairId } = req.params;
  Chair.get(chairId).run().then(c =>
    c.merge(req.body).save()
  )
  .then((chair) => {
    res.send(normalize(chair, chairsSchema));
  })
  .catch(next);
});

chairsRouter.delete('/:chairId', (req, res, next) => {
  const { chairId } = req.params;
  Chair.get(chairId).then(chair =>
    chair.delete()
  )
  .then((result) => {
    res.send(normalize(result, chairsSchema));
  })
  .catch(next);
});

module.exports = chairsRouter;
