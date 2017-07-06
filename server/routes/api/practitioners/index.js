const practitionersRouter = require('express').Router();
const authMiddleware = require('../../../middleware/auth');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const Practitioner = require('../../../models/Practitioner');
const WeeklySchedule = require('../../../models/WeeklySchedule');
const Account = require('../../../models/Account');
const Service = require('../../../models/Service');
const normalize = require('../normalize');
const _ = require('lodash');
const uuid = require('uuid');
const upload = require('../../../lib/upload');

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
  return Account.get(req.accountId).getJoin({ weeklySchedule: true }).run()
   .then((account) => {
     delete account.weeklySchedule.weeklyScheduleId;
     delete account.weeklySchedule.createdAt;
     delete account.weeklySchedule.id;

     //giving new prac the offices schedule

     WeeklySchedule.save(account.weeklySchedule)
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
         });
   })
   .catch(next);
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
 * Update a practitioner weekly schedule
 */
practitionersRouter.put('/:practitionerId/customSchedule', checkPermissions('practitioners:update'), (req, res, next) => {
  return Account.get(req.accountId).getJoin({ weeklySchedule: true }).run()
    .then((account) => {
      delete account.weeklySchedule.weeklyScheduleId;
      delete account.weeklySchedule.createdAt;
      delete account.weeklySchedule.id;

      WeeklySchedule.save(account.weeklySchedule)
        .then((weeklySchedule) => {
          const practitionerData = req.body
          practitionerData.weeklyScheduleId = weeklySchedule.id;
          Practitioner.get(req.practitioner.id).run()
            .then((practitioner) => {
              practitioner.merge(practitionerData).save().then((prac)=>{
                prac.weeklySchedule = weeklySchedule;
                res.status(201).send(normalize('practitioner', prac));
              });
            })
            .catch(next);
        });
    })
    .catch(next);
});

/**
 * Upload a practitioner's avatar
 */
practitionersRouter.post('/:practitionerId/avatar', checkPermissions('practitioners:update'), async (req, res, next) => {
  const fileKey = `avatars/${req.practitioner.id}/${uuid.v4()}_[size]_${req.files.file.name}`;

  try {
    await upload(fileKey, req.files.file.data);

    req.practitioner.avatarUrl = fileKey;

    const savedPractitioner = await req.practitioner.save();
    return res.send(normalize('practitioner', savedPractitioner));
  } catch (error) {
    return next(error);
  }
});

practitionersRouter.delete('/:practitionerId/avatar', checkPermissions('practitioners:update'), async (req, res, next) => {
  try {
    req.practitioner.avatarUrl = null;
    const savedPractitioner = await req.practitioner.save();
    res.send(normalize('practitioner', savedPractitioner));
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a practitioner
 */
practitionersRouter.delete('/:practitionerId', checkPermissions('practitioners:delete'), (req, res, next) => req.practitioner.delete()
    .then(() => res.sendStatus(204))
    .catch(next));


module.exports = practitionersRouter;
