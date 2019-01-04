import moment from 'moment-timezone';
import omit from 'lodash/omit';
import { Practitioner, WeeklySchedule, Account, Service, Practitioner_Service, Chair, DailySchedule } from 'CareCruModels';
import format from '../../util/format';
import handleSequelizeError from '../../util/handleSequelizeError';
import { sequelizeLoader } from '../../util/loaders';
import {
  dailyScheduleNameList,
  updateDaySchedules,
  deleteIsClosedFieldFromBody,
  dayNamesList,
} from '../../../_models/WeeklySchedule';

const practitionersRouter = require('express').Router();
const authMiddleware = require('../../../middleware/auth');
const checkPermissions = require('../../../middleware/checkPermissions');

const normalize = require('../normalize');

const isArray = require('lodash/isArray');
const uuid = require('uuid');
const upload = require('../../../lib/upload');

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
    return res.send(format(req, res, 'practitioners', practitioners));
  }).catch(next);
});

/**
 * Create a practitioner
 * A default WeeklySchedule for the practitioner will be created,
 * copying from the account's office hour
 */
practitionersRouter.post('/', checkPermissions('practitioners:create'), async (req, res, next) => {
  try {
    const { accountId, body } = req;

    const practitionerData = {
      ...body,
      accountId,
    };

    const practitionerTest = await Practitioner.build(practitionerData);
    await practitionerTest.validate();

    const account = await Account.findOne({
      where: { id: accountId },
      include: [
        {
          model: WeeklySchedule,
          as: 'weeklySchedule',
        },
      ],
    });

    const cleanedSchedule = cleanUpWeeklySchedule(account.weeklySchedule.get({ plain: true }));
    const weeklySchedule = await WeeklySchedule.create(
      cleanedSchedule,
      { include: Object.keys(dailyScheduleNameList).map(day => ({ association: day })) },
    );
    const practitioner = await Practitioner.create({
      ...body,
      accountId,
      weeklyScheduleId: weeklySchedule.id,
    });

    // Add practitionerId to all the dailySchedules
    const weeklyScheduleData = weeklySchedule.get({ plain: true });
    const updateBody = Object.keys(dailyScheduleNameList).reduce((acc, day) => ({
      ...acc,
      [day]: {
        ...weeklyScheduleData[day],
        practitionerId: practitioner.id,
      },
    }), weeklyScheduleData);

    await updateDaySchedules(weeklySchedule, updateBody, DailySchedule);

    return res.status(201).send(format(req, res, 'practitioner', practitioner.get({ plain: true })));
  } catch (e) {
    // check sequelize error
    if (e.errors && e.errors[0]) {
      return handleSequelizeError(e.errors[0], 'practitioner', res, req, next);
    }

    return next(e);
  }
});

/**
 * Get a single practitioner
 */
practitionersRouter.get('/:noFetchPractitionerId', checkPermissions('practitioners:read'), (req, res, next) => {
  return Practitioner.findOne({
    where: {
      id: req.params.noFetchPractitionerId,
    },

    include: req.includeArray,
  }).then(practitioner => res.send(format(req, res, 'practitioner', practitioner.get({ plain: true }))))
    .catch(next);
});

/**
 * Get a single practitioner
 */
practitionersRouter.get('/:practitionerId', checkPermissions('practitioners:read'), (req, res, next) => {
  return Promise.resolve(req.practitioner.get({ plain: true }))
  .then(practitioner => res.send(format(req, res, 'practitioner', practitioner)))
  .catch(next);
});

/**
 * Update a practitioner
 * This endpoint will NOT update the customized WeeklySchedule for the practitioner
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

    const promises = [];

    if (req.body.services && Array.isArray(req.body.services)) {
      practitioner.services.forEach((service) => {
        if (!newServices.includes(service)) {
          services.push(service.Practitioner_Service.id);
        }
      });

      newServices.forEach((newService) => {
        if (!practitioner.services.includes(newService)) {
          addServices.push(newService);
          promises.push(Practitioner_Service.create({
            practitionerId: practitioner.id,
            serviceId: newService,
          }));
        }
      });

      promises.push(Practitioner_Service.destroy({
        where: {
          id: services,
        },
        paranoid: false,
        force: true,
      }));
    }

    promises.push(Practitioner.update(req.body,
      {
        where: {
          id: req.practitioner.id,
        },
      },
    ));

    return Promise.all(promises)
    .then(() => {
      return Practitioner.findOne({
        where: { id: req.practitioner.id },
        include: [{ model: Service, as: 'services' }],
      })
      .then((practitionerDel) => {
        practitionerDel = practitionerDel.get({ plain: true });
        return res.send(format(req, res, 'practitioner', practitionerDel));
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
    .then(async (chairs) => {
      const chairIds = chairs.map(chair => chair.id);
      account.weeklySchedule.monday.chairIds = chairIds;
      account.weeklySchedule.tuesday.chairIds = chairIds;
      account.weeklySchedule.wednesday.chairIds = chairIds;
      account.weeklySchedule.thursday.chairIds = chairIds;
      account.weeklySchedule.friday.chairIds = chairIds;
      account.weeklySchedule.saturday.chairIds = chairIds;
      account.weeklySchedule.sunday.chairIds = chairIds;

      const prac = await Practitioner.findOne({
        where: {
          id: req.practitioner.id,
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

      if (prac.weeklySchedule.id) {
        await WeeklySchedule.update(account.weeklySchedule, {
          where: {
            id: prac.weeklySchedule.id,
          },
        });
        await req.practitioner.update(req.body);
      } else {
        const newSched = await WeeklySchedule.create(account.weeklySchedule);
        const practitionerData = req.body;
        practitionerData.weeklyScheduleId = newSched.dataValues.id;

        await req.practitioner.update(practitionerData);
      }

      const practitioner = await Practitioner.findOne({
        where: {
          id: req.practitioner.id,
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

      return res.status(201).send(normalize('practitioner', practitioner));
    });
  }).catch(next);
});

/**
 * Update a practitioners custom weekly schedule
 * This endpoint is ONLY used for connector sync
 */
practitionersRouter.put('/:practitionerId/weeklySchedule', async (req, res, next) => {
  try {
    const { practitioner, body } = req;
    const { weeklyScheduleId } = practitioner;

    await practitioner.update({ isCustomSchedule: true });
    const weeklySchedule = await WeeklySchedule.findByPk(practitioner.weeklyScheduleId);

    // Associate the DailySchedule Ids to the body
    const updateBody = dayNamesList.reduce((acc, day) => ({
      ...acc,
      [day]: {
        ...body[day],
        id: weeklySchedule[`${day}Id`],
      },
    }), body);
    const deletedIsClosedBody = deleteIsClosedFieldFromBody(updateBody);

    await updateDaySchedules(weeklySchedule, deletedIsClosedBody, DailySchedule);
    await weeklySchedule.update(body);
    const updatedSchedule = await WeeklySchedule.findByPk(weeklyScheduleId);

    return res.send(format(req, res, 'weeklySchedule', updatedSchedule.get({ plain: true })));
  } catch (error) {
    return next(error);
  }
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
    return res.send(normalize('practitioner', savedPractitioner.get({ plain: true })));
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

/**
 * Clean up the weeklySchedule model to reuse it for creating new weeklySchedule.
 * This function is used for converting a officeHour to a weeklySchedule
 * @param weeklySchedule
 */
function cleanUpWeeklySchedule(weeklySchedule) {
  const cleanedWeeklySchedule = omit(weeklySchedule, ['id', 'createdAt', 'updatedAt']);

  return Object.keys(dailyScheduleNameList).reduce((acc, day) => ({
    ...acc,
    [day]: omit(cleanedWeeklySchedule[day], ['id', 'createdAt', 'updatedAt']),
  }), cleanedWeeklySchedule);
}

module.exports = practitionersRouter;
