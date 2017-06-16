
const practitionersRouter = require('express').Router();
const authMiddleware = require('../../../middleware/auth');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const Practitioner = require('../../../models/Practitioner');
const WeeklySchedule = require('../../../models/WeeklySchedule');
const Service = require('../../../models/Service');
const normalize = require('../normalize');
const _ = require('lodash');
const fileUpload = require('express-fileupload');
const uuid = require('uuid');
const s3 = require('../../../config/s3');

practitionersRouter.param('practitionerId', loaders('practitioner', 'Practitioner'));

/**
 * Get all practitioners under a clinic
 */
practitionersRouter.get('/', (req, res, next) => {
  // const accountId = req.query.accountId || req.accountId;
  const {
    accountId,
    joinObject,
  } = req;
  // const { accountId } = req;

  return Practitioner.filter({ accountId }).getJoin(joinObject).run()
    .then(practitioners => res.send(normalize('practitioners', practitioners)))
    .catch(next);
});

/**
 * Create a practitioner
 */
practitionersRouter.post('/', checkPermissions('practitioners:create'), (req, res, next) => {
  const weeklyScheduleData = Object.assign({}, { accountId: req.accountId });

  return WeeklySchedule.save(weeklyScheduleData)
    .then((weeklySchedule) => {
      const practitionerData = Object.assign({},
        { accountId: req.accountId,
          weeklyScheduleId: weeklySchedule.id,
        },
        req.body);
      Practitioner.save(practitionerData)
        .then((practitioner) => {
          practitioner.weeklySchedule = weeklySchedule;
          res.status(201).send(normalize('practitioner', practitioner));
        })
        .catch(next);
    }).catch(next);
});

/**
 * Get a single practitioner
 */
practitionersRouter.get('/:practitionerId', checkPermissions('practitioners:read'), (req, res, next) => Promise.resolve(req.practitioner)
    .then(practitioner => res.send(normalize('practitioner', practitioner)))
    .catch(next));

/**
 * Update a practitioner
 */
practitionersRouter.put('/:practitionerId', checkPermissions('practitioners:update'), (req, res, next) =>

  // TODO: how to Query Practitioners based on service

   Practitioner.get(req.practitioner.id).getJoin({ services: true }).run()
   .then((practitioner) => {
     practitioner.merge(req.body).saveAll({ services: true })
       .then((practitionerServices) => {
         res.send(normalize('practitioner', practitionerServices));
       }).catch(next);
   }));

/**
 * Upload a practitioner's avatar
 */
practitionersRouter.post('/:practitionerId/avatar', checkPermissions('practitioners:update'), fileUpload(), async (req, res, next) => {
  const fileKey = `avatars/${req.practitioner.id}/${uuid.v4()}/${req.files.file.name}`;
  console.log(req.files.file);
  s3.upload({
    Key: fileKey,
    Body: req.files.file.data,
    ACL: 'public-read',
  }, async (err, response) => {
    console.log(err);
    if (err) {
      return next(err);
    }
    try {
      req.practitioner.avatarUrl = fileKey;
      console.log(req.practitioner);
        
      const savedPractitioner = await req.practitioner.save();
      res.send(normalize('practitioner', savedPractitioner));
    } catch (error) {
      next(error);
    }
  });
});
/**
 * Delete a practitioner
 */
practitionersRouter.delete('/:practitionerId', checkPermissions('practitioners:delete'), (req, res, next) => req.practitioner.delete()
    .then(() => res.sendStatus(204))
    .catch(next));


module.exports = practitionersRouter;
