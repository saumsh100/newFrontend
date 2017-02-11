const { normalize, Schema, arrayOf } = require('normalizr');
const practitionersRouter = require('express').Router();
const Practitioner = require('../../../models/Practitioner');

const practitionerSchema = new Schema('practitioners');


practitionersRouter.get('/', (req, res, next) => {
  Practitioner.run()
    .then(practitioners => res.send(normalize(practitioners, arrayOf(practitionerSchema))))
    .catch(next);
});
module.exports = practitionersRouter;
