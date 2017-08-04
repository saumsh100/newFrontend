
import { Router } from 'express';
import { pick } from 'lodash';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import StatusError from '../../../util/StatusError';
import {
  Account,
  Appointment,
  Enterprise,
  Reminder,
  Recall,
  Service,
  User,
  WeeklySchedule,
  Patient,
  Segment,
  Practitioner,
  sequelize,
} from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';
import { UserAuth } from '../../../lib/_auth';
const { timeWithZone } = require('../../../util/time');

const enterprisesRouter = Router();

enterprisesRouter.param('enterpriseId', sequelizeLoader('enterprise', 'Enterprise'));
enterprisesRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * GET /
 */
enterprisesRouter.get('/', checkPermissions('enterprises:read'), (req, res, next) => {
  return Enterprise.all({ raw: true })
    .then(enterprises => res.send(normalize('enterprises', enterprises)))
    .catch(next);
});

/**
 * GET /:enterpriseId
 */
enterprisesRouter.get('/:enterpriseId', checkPermissions('enterprises:read'), (req, res, next) => {
  try {
    res.send(normalize('enterprise', req.enterprise.dataValues));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:enterpriseId/accounts
 */
enterprisesRouter.get('/:enterpriseId/accounts', checkPermissions(['enterprises:read', 'accounts:read']), async (req, res, next) => {
  try {
    const accounts = await Account.findAll({
      raw: true,
      where: {
        enterpriseId: req.enterprise.id,
      },
    });

    res.send(normalize('accounts', accounts));
  } catch (err) {
    next(err);
  }
});

/**
 * POST /
 */
enterprisesRouter.post('/', checkPermissions('enterprises:create'), (req, res, next) => {
  return Enterprise.create(pick(req.body, ['name', 'plan']))
    .then(enterprise => res.send(201, normalize('enterprise', enterprise.dataValues)))
    .catch(next);
});

/**
 * POST /switch
 */
enterprisesRouter.post('/switch', checkPermissions('enterprises:read'), async (req, res, next) => {
  try {
    const { userId, body: { enterpriseId }, sessionData, sessionId } = req;
    const accounts = await Account.findAll({
      where: { enterpriseId },
    });

    if (!accounts.length) {
      throw StatusError(400, 'Cannot switch to an enterprise that does not have any accounts');
    }

    // Make first account the activeAccount
    const [{ id: accountId }] = accounts;

    // Update user data with new session info
    const user = await User.findById(userId);
    await user.update({ activeAccountId: accountId, enterpriseId });

    // Create a new session
    console.log('sessionData', sessionData);
    console.log('accountId', accountId);
    console.log('enterpriseId', enterpriseId);

    const newSession = await UserAuth.updateSession(sessionId, sessionData, {
      accountId,
      enterpriseId,
    });

    // Sign token with new session
    const token = await UserAuth.signToken({
      userId: sessionData.userId,
      sessionId: newSession.id,
      activeAccountId: accountId,
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:enterpriseId/accounts
 */
enterprisesRouter.post('/:enterpriseId/accounts', checkPermissions(['enterprises:read', 'accounts:update']), (req, res, next) => {
  const accountData = {
    ...pick(req.body, 'name', 'timezone', 'id'),
    enterpriseId: req.enterprise.id,
  };

  const timezone = req.body.timezone;

  Account.create(accountData)
    .then((account) => {
      const defaultReminders = [
        {
          // 21 day email
          accountId: account.id,
          primaryType: 'email',
          lengthSeconds: 21 * 24 * 60 * 60,
        },
        {
          // 7 day sms
          accountId: account.id,
          primaryType: 'sms',
          lengthSeconds: 7 * 24 * 60 * 60,
        },
        {
          // 1 day sms
          accountId: account.id,
          primaryType: 'phone',
          lengthSeconds: 24 * 60 * 60,
        },
        {
          // 2 hour sms
          accountId: account.id,
          primaryType: 'sms',
          lengthSeconds: 2 * 60 * 60,
        },
      ];

      const defaultRecalls =  [
        {
          // 6 month recall
          accountId: account.id,
          primaryType: 'email',
          lengthSeconds: 6 * 30 * 24 * 60 * 60,
        },
      ];

      const defaultServices = [
        {
          accountId: account.id,
          bufferTime: 0,
          name: 'New Patient Consultation',
          duration: 30,
        },
        {
          accountId: account.id,
          bufferTime: 0,
          name: 'Lost Filling',
          duration: 30,
        },
        {
          accountId: account.id,
          bufferTime: 0,
          name: 'Emergency Appointment',
          duration: 30,
        },
        {
          accountId: account.id,
          bufferTime: 0,
          name: 'Regular Checkup & Cleaning',
          duration: 30,
        },
        {
          accountId: account.id,
          bufferTime: 0,
          name: 'Regular Consultation',
          duration: 30,
        },
        {
          accountId: account.id,
          bufferTime: 0,
          name: 'Child Dental Exam',
          duration: 30,
        },

      ];

      const defaultSchdedule = {
        accountId: account.id,
        monday: {
          startTime: timeWithZone(8, 0, timezone),
          endTime: timeWithZone(17, 0, timezone),
          breaks: [
            {
              startTime: timeWithZone(12, 0, timezone),
              endTime: timeWithZone(13, 0, timezone),
            },
          ],
        },
        tuesday: {
          startTime: timeWithZone(8, 0, timezone),
          endTime: timeWithZone(17, 0, timezone),
          breaks: [
            {
              startTime: timeWithZone(12, 0, timezone),
              endTime: timeWithZone(13, 0, timezone),
            },
          ],
        },
        wednesday: {
          startTime: timeWithZone(8, 0, timezone),
          endTime: timeWithZone(17, 0, timezone),
          breaks: [
            {
              startTime: timeWithZone(12, 0, timezone),
              endTime: timeWithZone(13, 0, timezone),
            },
          ],

        },
        thursday: {
          startTime: timeWithZone(8, 0, timezone),
          endTime: timeWithZone(17, 0, timezone),
          breaks: [
            {
              startTime: timeWithZone(12, 0, timezone),
              endTime: timeWithZone(13, 0, timezone),
            },
          ],
        },
        friday: {
          startTime: timeWithZone(8, 0, timezone),
          endTime: timeWithZone(17, 0, timezone),
          breaks: [
            {
              startTime: timeWithZone(12, 0, timezone),
              endTime: timeWithZone(13, 0, timezone),
            },
          ],

        },
        saturday: {
          startTime: timeWithZone(8, 0, timezone),
          endTime: timeWithZone(17, 0, timezone),
          breaks: [
            {
              startTime: timeWithZone(12, 0, timezone),
              endTime: timeWithZone(13, 0, timezone),
            },
          ],

        },
        sunday: {
          startTime: timeWithZone(8, 0, timezone),
          endTime: timeWithZone(17, 0, timezone),
          breaks: [
            {
              startTime: timeWithZone(12, 0, timezone),
              endTime: timeWithZone(13, 0, timezone),
            },
          ],

        },
      };

      Promise.all([
        Reminder.bulkCreate(defaultReminders),
        WeeklySchedule.create(defaultSchdedule),
        Service.bulkCreate(defaultServices),
        Recall.bulkCreate(defaultRecalls),
      ]).then((values) => {
        account.update({ weeklyScheduleId: values[1].id })
          .then((acct) => res.status(201).send(normalize('account', acct.dataValues)));
      });
    })
    .catch(next);
});

enterprisesRouter.put('/:enterpriseId', checkPermissions('enterprises:update'), (req, res, next) => {
  req.enterprise.update(pick(req.body, ['name', 'plan']))
    .then(enterprise => res.send(normalize('enterprise', enterprise.dataValues)))
    .catch(next);
});

enterprisesRouter.put(
  '/:enterpriseId/accounts/:accountId',
  checkPermissions(['enterprises:read', 'accounts:update']),
  (req, res, next) => {
    req.account.update(pick(req.body, ['name']))
      .then(account => res.send(normalize('account', account.dataValues)))
      .catch(next);
  }
);

enterprisesRouter.delete('/:enterpriseId', checkPermissions('enterprises:delete'), (req, res, next) => {
  req.enterprise.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});

enterprisesRouter.delete(
  '/:enterpriseId/accounts/:accountId',
  checkPermissions(['enterprises:read', 'accounts:delete']),
  (req, res, next) => {
    req.account.destroy()
      .then(() => res.sendStatus(204))
      .catch(next);
  }
);

enterprisesRouter.get('/enterprise/:enterpriseId/accounts/cities', checkPermissions('enterprises:read'), async (req, res, next) => {
  // @TODO missing details for cities
});

enterprisesRouter.get('/dashboard/patients', checkPermissions('segments:read'), async (req, res, next) => {
  const { segmentId, startDate, endDate } = req.query;
  try {
    if (!startDate || !endDate) {
      throw StatusError(StatusError.BAD_REQUEST, 'Missing start and end time');
    }
    const attributes = ['accountId', [sequelize.fn('count', sequelize.col('*')), 'patientCount']];

    // fetch all enterprise accounts
    const accounts = await Account.findAll({
      raw: true,
      where: {
        enterpriseId: req.enterpriseId,
      },
    });
    const accountIds = [];
    const clinics = {};
    accounts.forEach((account) => {
      accountIds.push(account.id);
      clinics[account.id] = account;
    });

    const baseWhere = {
      accountId: accountIds,
    };

    // Set date where condition
    const dateWhere = {
      createdAt: {
        $between: [startDate, endDate],
      },
    };

    const activeWhere = {
      status: Patient.STATUS.ACTIVE,
    };

    let segmentWhere = null;
    if (segmentId) {
      const segment = await Segment.findById(segmentId);

      // if segment is null throw error
      if (!segment) {
        throw new StatusError(StatusError.BAD_REQUEST, `Data for Segment with id: ${segmentId} do not exists`);
      }
      // confirm if user has sent segment he has access to use
      segment.isOwner(req);

      segmentWhere = segment.where || {};
    }
    const activePatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere };
    const activePatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      group: ['Patient.accountId'],
    });

    // fetch new patients (E.g. created at between start/end date)
    const newPatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere, ...dateWhere };
    const newPatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: newPatientsWhere,
      group: ['Patient.accountId'],
    });

    console.log(newPatientsWhere);

    const hygienePatients = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      include: [
        {
          attributes: [],
          model: Appointment,
          as: 'appointments',
          required: true,
          include: [
            {
              attributes: [],
              model: Practitioner,
              as: 'practitioner',
              required: true,
              where: {
                type: Practitioner.TYPE.HYGIENIST,
              },
            },
          ],
        },
      ],
      group: ['Patient.accountId'],
    });

    let totalActivePatients = 0;
    activePatientsData.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      clinics[clinic.accountId].activePatients = patients;
      totalActivePatients += patients;
    });

    let totalHygienePatients = 0;
    hygienePatients.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      clinics[clinic.accountId].hygienePatients = patients;
      totalHygienePatients += patients;
    });

    let totalNewPatients = 0;
    newPatientsData.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      clinics[clinic.accountId].newPatients = patients;
      totalNewPatients += patients;
    });

    const dashboardData = {
      entities: {
        enterpriseDashboard: {
          patients: {
            id: 'patients',
            clinics: accounts,
            totals: {
              totalActivePatients,
              totalHygienePatients,
              totalNewPatients,
            },
          },
        },
      },
    };


    return res.send(dashboardData);
  } catch (error) {
    return next(error);
  }
});

export default enterprisesRouter;
