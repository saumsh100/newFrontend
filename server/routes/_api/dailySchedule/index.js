
import { DailySchedule } from 'CareCruModels';
import { sequelizeLoader } from '../../util/loaders';
import format from '../../util/format';
import batchCreate, { batchUpdate } from '../../util/batch';
import { isPMSIdViolation } from '../../util/handleSequelizeError';
import generateDailySchedulesForPractitioners from '../../../lib/schedule/practitioners/produceFinalDailySchedulesForPractitioners';
import StatusError from '../../../util/StatusError';

const dailyScheduleRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');


dailyScheduleRouter.param('dailyScheduleId', sequelizeLoader('dailySchedule', 'DailySchedule'));

/**
 * Create a dailySchedule
 */
dailyScheduleRouter.post('/', checkPermissions('dailySchedules:create'), async (req, res, next) => {
  try {
    const dailyScheduleData = {
      ...req.body,
      accountId: req.accountId,
    }

    const dailyScheduleTest = await DailySchedule.build(dailyScheduleData);
    await dailyScheduleTest.validate();

    return DailySchedule.create(dailyScheduleData)
      .then((ds) => {
        const normalized = format(req, res, 'dailySchedule', ds.get({ plain: true }));
        return res.status(201).send(normalized);
      });
  } catch (e) {
    return isPMSIdViolation(e, 'PractitionerId PMS ID Violation', 'dailySchedule', req, res, next);
  }
});

/**
 * Batch Create a dailySchedule from PMS
 */
dailyScheduleRouter.post('/connector/batch', checkPermissions('dailySchedules:create'), async (req, res, next) => {
  const dailySchedules = req.body;
  const { accountId } = req;

  try {
    // Add accountId to the dailySchedule to it fits the current daily schedule schema
    const cleanedDailySchedule = dailySchedules.reduce((acc, dailySchedule) => ([
      ...acc,
      {
        ...dailySchedule,
        accountId,
      },
    ]), []);
    const savedDailySchedules = await batchCreate(cleanedDailySchedule, DailySchedule, 'dailySchedules');

    const savedDailySchedulesData = savedDailySchedules.map(savedDailySchedule =>
      savedDailySchedule.get({ plain: true }));

    return res.status(201).send(format(req, res, 'dailySchedules', savedDailySchedulesData));
  } catch ({ errors, docs }) {
    try {
      const documents = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });
      const data = format(req, res, 'dailySchedules', documents);
      return res.status(201).send(Object.assign({}, data));
    } catch (e) {
      return next(e);
    }
  }
});

/**
 * Batch Update a dailySchedule from PMS
 */
dailyScheduleRouter.put('/connector/batch', checkPermissions('dailySchedules:update'), async (req, res, next) => {
  const dailySchedules = req.body;

  try {
    const savedDailySchedules = await batchUpdate(dailySchedules, DailySchedule, 'cleanedDailySchedule');

    const dailyScheduleData = savedDailySchedules.map(savedDailySchedule =>
      savedDailySchedule.get({ plain: true }));

    return res.status(201).send(format(req, res, 'dailySchedules', dailyScheduleData));
  } catch ({ errors, docs }) {
    try {
      const documents = docs.map(d => d.get({ plain: true }));

      // Log any errors that occurred
      errors.forEach((err) => {
        console.error(err);
      });

      const data = format(req, res, 'dailySchedules', documents);
      return res.status(201).send(data);
    } catch (e) {
      return next(e);
    }
  }
});

/**
 * Update a dailySchedule
 */
dailyScheduleRouter.put('/:dailyScheduleId', checkPermissions('dailySchedules:update'), async (req, res, next) => {
  try {
    const dailySchedule = await req.dailySchedule.update(req.body);
    return res.send(format(req, res, 'practitionerSchedule', dailySchedule.get({ plain: true })));
  } catch (e) {
    return next(e);
  }
});

/**
 * Delete a dailySchedule
 */
dailyScheduleRouter.delete('/:dailyScheduleId', checkPermissions('dailySchedules:delete'), async (req, res, next) => {
  try {
    await req.dailySchedule.destroy();
    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
});

/**
 * GET /finalDailySchedules
 * Retrieve the final daily schedules for practitioners in the same practice for a period of time.
 * The params are:
 * practitionerIds: array of the practitioner Ids. Eg: ["uuid1", "uuid2"]
 * fromDate: the startDate of the time range. Eg: 2018-01-01
 * toDate: optional, the endDate of the time range. If not provided, the time range is just one day.
 */
dailyScheduleRouter.get('/finalDailySchedules', async ({ query, accountId }, res, next) => {
  const { fromDate, toDate, practitionerIds, reasonId } = query;
  if (!practitionerIds || !fromDate || !reasonId) {
    next(new StatusError(StatusError.BAD_REQUEST, 'Please provide at least fromDate, practitionerIds and reasonId'));
  }

  try {
    const practitionersSchedule = await generateDailySchedulesForPractitioners({
      accountId,
      serviceId: reasonId,
      practitionerId: practitionerIds,
      startDate: fromDate,
      endDate: toDate,
    });

    return res.send(practitionersSchedule);
  } catch (e) {
    return next(e);
  }
});

module.exports = dailyScheduleRouter;
