import { sequelizeLoader } from '../../util/loaders';

const practitionersRouter = require('express').Router();
const authMiddleware = require('../../../middleware/auth');
const checkPermissions = require('../../../middleware/checkPermissions');

const normalize = require('../normalize');
const _ = require('lodash');
const uuid = require('uuid');
const upload = require('../../../lib/upload');
import moment from 'moment-timezone';

import { Practitioner, WeeklySchedule, Account, Service, Practitioner_Service, Chair } from '../../../_models';


practitionersRouter.param('practitionerId', sequelizeLoader('practitioner', 'Practitioner'));

/**
 * Get all practitioners under a clinic
 */
practitionersRouter.get('/', (req, res, next) => {
  // const accountId = req.query.accountId || req.accountId;
  const {
    accountId,
    includeArray,
  } = req;
  // const { accountId } = req;
  return Practitioner.findAll({
    where: { accountId },
    include: includeArray,
  })
  .then((practitioners) => {
    practitioners = practitioners.map((practitioner) => {
      return practitioner.get({ plain: true });
    });
    return res.send(normalize('practitioners', practitioners));
  }).catch(next);
});

/**
 * Create a practitioner
 */
practitionersRouter.post('/', checkPermissions('practitioners:create'), (req, res, next) => {
  return Account.findOne({
    where: { id: req.accountId },
    raw: true,
    nest: true,
    include: [
      {
        model: WeeklySchedule,
        as: 'weeklySchedule',
      },
    ],
  })
  .then((account) => {
    delete account.weeklySchedule.weeklyScheduleId;
    delete account.weeklySchedule.createdAt;
    delete account.weeklySchedule.id;
    return WeeklySchedule.create(account.weeklySchedule)
    .then((weeklySchedule) => {
      weeklySchedule = weeklySchedule.get({ plain: true });
      const practitionerData = Object.assign({},
        {
          accountId: req.accountId,
          weeklyScheduleId: weeklySchedule.id,
        }, req.body);
      return Practitioner.create(practitionerData)
      .then((practitioner) => {
        practitioner = practitioner.get({ plain: true });
        practitioner.weeklySchedule = weeklySchedule;
        return res.status(201).send(normalize('practitioner', practitioner));
      });
    });
  }).catch(next);
});

/**
 * Get a single practitioner
 */
practitionersRouter.get('/:practitionerId', checkPermissions('practitioners:read'), (req, res, next) => {
  return Promise.resolve(req.practitioner.get({ plain: true }))
  .then(practitioner => res.send(normalize('practitioner', practitioner)))
  .catch(next);
});

/**
 * Update a practitioner
 */
practitionersRouter.put('/:practitionerId', checkPermissions('practitioners:update'), (req, res, next) => {
  const newServices = req.body.services || [];
  // TODO: how to Query Practitioners based on service
  return Practitioner.findOne({
    where: { id: req.practitioner.id },
    include: [{ model: Service, as: 'services' }],
  })
  .then((practitioner) => {
    practitioner = practitioner.get({ plain: true });
    const services = [];
    const addServices = [];

    practitioner.services.forEach((service) => {
      if (!newServices.includes(service)) {
        services.push(service.Practitioner_Service.id);
      }
    });
    const promises = [];

    newServices.forEach((newService) => {
      if (!practitioner.services.includes(newService)) {
        addServices.push(newService);
        promises.push(Practitioner_Service.create({
          practitionerId: practitioner.id,
          serviceId: newService,
        }));
      }
    });

    promises.push(Practitioner.update(req.body, { where: { id: req.practitioner.id } }));
    promises.push(Practitioner_Service.destroy({
      where: {
        id: services,
      },
      paranoid: false,
      force: true,
    }));
    return Promise.all(promises)
    .then(() => {
      return Practitioner.findOne({
        where: { id: req.practitioner.id },
        include: [{ model: Service, as: 'services' }],
      })
      .then((practitionerDel) => {
        practitionerDel = practitionerDel.get({ plain: true });
        return res.send(normalize('practitioner', practitionerDel));
      });
    });
  }).catch(next)
});

/**
 * Update a practitioners custom weekly schedule
 */
practitionersRouter.put('/:practitionerId/customSchedule', (req, res, next) => {
  return Account.findOne({
    where: { id: req.accountId },
    raw: true,
    nest: true,
    include: [
      {
        model: WeeklySchedule,
        as: 'weeklySchedule',
      },
    ],
  })
  .then((account) => {
    delete account.weeklySchedule.weeklyScheduleId;
    delete account.weeklySchedule.createdAt;
    delete account.weeklySchedule.id;
    return Chair.findAll({
      raw: true,
      where: { accountId: req.accountId },
    })
    .then((chairs) => {
      const chairIds = chairs.map(chair => chair.id);
      account.weeklySchedule.monday.chairIds = chairIds;
      account.weeklySchedule.tuesday.chairIds = chairIds;
      account.weeklySchedule.wednesday.chairIds = chairIds;
      account.weeklySchedule.thursday.chairIds = chairIds;
      account.weeklySchedule.friday.chairIds = chairIds;
      account.weeklySchedule.saturday.chairIds = chairIds;
      account.weeklySchedule.sunday.chairIds = chairIds;

      return WeeklySchedule.create(account.weeklySchedule)
      .then((weeklySchedule) => {
        const practitionerData = req.body;
        practitionerData.weeklyScheduleId = weeklySchedule.dataValues.id;
        return req.practitioner
        .update(practitionerData)
        .then(async (practitioner) => {
          const prac = await Practitioner.findOne({
            where: {
              id: practitioner.dataValues.id,
            },
            include: [
              {
                model: WeeklySchedule,
                as: 'weeklySchedule',
                required: false,
              },
            ],
            raw: true,
            nest: true,
          });

          return res.status(201).send(normalize('practitioner', prac));
        });
      });
    });
  }).catch(next);
});

/**
 * Upload a practitioner's avatar
 */
practitionersRouter.post('/:practitionerId/avatar', checkPermissions('practitioners:update'), async (req, res, next) => {
  const fileKey = `avatars/${req.practitioner.id}/${uuid.v4()}_[size]_${req.files.file.name}`;

  try {
    await upload(fileKey, req.files.file.data);

    req.practitioner.avatarUrl = fileKey;

    const practitionerData = {
      avatarUrl: fileKey,
    };

    const savedPractitioner = await req.practitioner.update(practitionerData);
    return res.send(normalize('practitioner', savedPractitioner));
  } catch (error) {
    return next(error);
  }
});

practitionersRouter.delete('/:practitionerId/avatar', checkPermissions('practitioners:update'), async (req, res, next) => {
  try {
    const practitionerData = {
      avatarUrl: null,
    };

    const savedPractitioner = await req.practitioner.update(practitionerData);
    res.send(normalize('practitioner', savedPractitioner));
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a practitioner
 */
practitionersRouter.delete('/:practitionerId', checkPermissions('practitioners:delete'), (req, res, next) => req.practitioner.destroy()
    .then(() => res.sendStatus(204))
    .catch(next));


module.exports = practitionersRouter;
