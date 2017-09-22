import moment from 'moment';
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
import createAccount from '../../../lib/createAccount';

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
    .then(enterprise => res.status(201).send(normalize('enterprise', enterprise.dataValues)))
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
enterprisesRouter.post('/:enterpriseId/accounts', checkPermissions(['enterprises:read', 'accounts:update']), async (req, res, next) => {
  const accountData = {
    ...pick(req.body, 'name', 'timezone', 'destinationPhoneNumber', 'street', 'city', 'zipCode', 'state', 'country', 'id'),
    enterpriseId: req.enterprise.id,
  };
  console.log(req.query);

  const timezone = req.body.timezone;
  return Account.create(accountData)
    .then(async (accountFirst) => {

      const newData = await createAccount(accountFirst, req.query);
      accountFirst.callrailId = newData.callrailId;
      accountFirst.vendastaId = newData.vendastaId;
      accountFirst.vendastaAccountId = newData.vendastaAccountId;
      accountFirst.twilioPhoneNumber = newData.twilioPhoneNumber;
      accountFirst.vendastaMsId = newData.vendastaMsId;
      const account = await accountFirst.save();

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

enterprisesRouter.get('/:enterpriseId/accounts/cities', checkPermissions(['enterprises:read', 'accounts:read']), async (req, res, next) => {
  try {
    const accounts = await Account.findAll({
      raw: true,
      attributes: ['city'],
      where: {
        enterpriseId: req.enterpriseId,
      },
    });

    return res.send(accounts);
  } catch (error) {
    return next(error);
  }
});

enterprisesRouter.get('/dashboard/patients', checkPermissions(['enterprises:read', 'accounts:read', 'segments:read']), async (req, res, next) => {
  const { segmentId, startDate = moment().toISOString(), endDate = moment().add(-30, 'days').toISOString(), rawWhere = false, by = 'total' } = req.query;
  try {
    const { account: accountSegmentWhere, patient: segmentWhere } = (await Segment.convertOrFetch(rawWhere || segmentId || {}, req)); // eslint-disable-line

    // repeteable query object data
    const attributes = ['accountId', [sequelize.fn('count', sequelize.col('*')), 'patientCount']];
    const monthAttributes = ['accountId', [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'date'], [sequelize.fn('count', sequelize.col('*')), 'patientCount']];
    const monthGroup = ['Patient.accountId', sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))];

    let totalActivePatients = 0;
    let totalHygienePatients = 0;
    let totalNewPatients = 0;

    accountSegmentWhere.enterpriseId = req.enterpriseId;

    // fetch all enterprise accounts
    const accounts = await Account.findAll({
      raw: true,
      where: accountSegmentWhere,
    });
    const accountIds = [];
    const clinics = {};
    accounts.forEach((account) => {
      accountIds.push(account.id);
      clinics[account.id] = account;
      // set base for active patients
      clinics[account.id].activePatients = {
        total: 0,
        month: [],
      };

      // set base for hygiene patients
      clinics[account.id].hygienePatients = {
        total: 0,
        month: [],
      };

      // set base for new patients
      clinics[account.id].newPatients = {
        total: 0,
        month: [],
      };
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

    const activePatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere };

    const activePatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      group: ['Patient.accountId'],
    });

    const activePatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: monthAttributes,
      where: activePatientsWhere,
      group: monthGroup,
    });

    // fetch new patients (E.g. created at between start/end date)
    const newPatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere, ...dateWhere };
    const newPatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: newPatientsWhere,
      group: ['Patient.accountId'],
    });

    const newPatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: monthAttributes,
      where: newPatientsWhere,
      group: monthGroup,
    });

    const hygieneInclude = [
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
    ];

    const hygienePatients = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      include: hygieneInclude,
      group: ['Patient.accountId'],
    });

    const hygienePatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: ['Patient.accountId', [sequelize.fn('date_trunc', 'month', sequelize.col('Patient.createdAt')), 'date'], [sequelize.fn('count', sequelize.col('*')), 'patientCount']],
      where: activePatientsWhere,
      include: hygieneInclude,
      group: ['Patient.accountId', sequelize.fn('date_trunc', 'month', sequelize.col('Patient.createdAt'))],
    });

    // Prepare and map data
    activePatientsData.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      clinics[clinic.accountId].activePatients.total = patients;
      totalActivePatients += patients;
    });

    activePatientsByMonth.forEach((month) => {
      clinics[month.accountId].activePatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });

    hygienePatients.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      clinics[clinic.accountId].hygienePatients.total = patients;
      totalHygienePatients += patients;
    });

    hygienePatientsByMonth.forEach((month) => {
      clinics[month.accountId].hygienePatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });

    newPatientsData.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      clinics[clinic.accountId].newPatients.total = patients;
      totalNewPatients += patients;
    });

    newPatientsByMonth.forEach((month) => {
      clinics[month.accountId].newPatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });


    const dashboardData = {
      entities: {
        enterpriseDashboard: {
          patients: {
            id: 'patients',
            clinics,
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

enterprisesRouter.get('/dashboard/patients/region', checkPermissions(['enterprises:read', 'accounts:read', 'segments:read']), async (req, res, next) => {
  const { segmentId, startDate = moment().toISOString(), endDate = moment().add(-30, 'days').toISOString(), rawWhere = false, by = 'total' } = req.query;
  try {
    const { account: accountSegmentWhere, patient: segmentWhere } = (await Segment.convertOrFetch(rawWhere || segmentId || {}, req)); // eslint-disable-line

    // repeteable query object data
    const attributes = [[sequelize.fn('count', sequelize.col('Patient.id')), 'patientCount']];
    const monthAttributes = [[sequelize.fn('date_trunc', 'month', sequelize.col('Patient.createdAt')), 'date'], [sequelize.fn('count', sequelize.col('Patient.id')), 'patientCount']];
    const monthGroup = ['city', sequelize.fn('date_trunc', 'month', sequelize.col('Patient.createdAt'))];

    let totalActivePatients = 0;
    let totalHygienePatients = 0;
    let totalNewPatients = 0;

    accountSegmentWhere.enterpriseId = req.enterpriseId;

    // fetch all enterprise accounts
    const accounts = await Account.findAll({
      attributes: ['city'],
      raw: true,
      where: accountSegmentWhere,
      group: ['city'],
    });
    const regions = {};
    accounts.forEach((account) => {
      regions[account.city] = account;
      // set base for active patients
      regions[account.city].activePatients = {
        total: 0,
        month: [],
      };

      // set base for hygiene patients
      regions[account.city].hygienePatients = {
        total: 0,
        month: [],
      };

      // set base for new patients
      regions[account.city].newPatients = {
        total: 0,
        month: [],
      };
    });

    const accountInclude = {
      attributes: ['city'],
      model: Account,
      as: 'account',
      where: accountSegmentWhere,
    };

    const baseWhere = {};

    // Set date where condition
    const dateWhere = {
      createdAt: {
        $between: [startDate, endDate],
      },
    };

    const activeWhere = {
      status: Patient.STATUS.ACTIVE,
    };

    const activePatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere };

    const activePatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      include: [accountInclude],
      group: ['city'],
    });

    const activePatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: monthAttributes,
      include: [accountInclude],
      where: activePatientsWhere,
      group: monthGroup,
    });

    // fetch new patients (E.g. created at between start/end date)
    const newPatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere, ...dateWhere };
    const newPatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: newPatientsWhere,
      include: [accountInclude],
      group: ['city'],
    });

    const newPatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: monthAttributes,
      include: [accountInclude],
      where: newPatientsWhere,
      group: monthGroup,
    });

    const hygieneInclude = [
      accountInclude,
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
    ];

    const hygienePatients = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      include: hygieneInclude,
      group: ['city'],
    });

    const hygienePatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: [[sequelize.fn('date_trunc', 'month', sequelize.col('Patient.createdAt')), 'date'], [sequelize.fn('count', sequelize.col('*')), 'patientCount']],
      where: activePatientsWhere,
      include: hygieneInclude,
      group: monthGroup,
    });

    // Prepare and map data
    activePatientsData.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      console.log(clinic);
      console.log(regions);
      regions[clinic['account.city']].activePatients.total = patients;
      totalActivePatients += patients;
    });

    activePatientsByMonth.forEach((month) => {
      regions[month['account.city']].activePatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });

    hygienePatients.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      regions[clinic['account.city']].hygienePatients.total = patients;
      totalHygienePatients += patients;
    });

    hygienePatientsByMonth.forEach((month) => {
      regions[month['account.city']].hygienePatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });

    newPatientsData.forEach((clinic) => {
      const patients = parseInt(clinic.patientCount, 10);
      regions[clinic['account.city']].newPatients.total = patients;
      totalNewPatients += patients;
    });

    newPatientsByMonth.forEach((month) => {
      regions[month['account.city']].newPatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });


    const dashboardData = {
      entities: {
        enterpriseDashboard: {
          patients: {
            id: 'patients',
            regions,
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

enterprisesRouter.get('/dashboard/patients/practitioner', checkPermissions(['enterprises:read', 'accounts:read', 'segments:read']), async (req, res, next) => {
  const { segmentId, startDate = moment().toISOString(), endDate = moment().add(-30, 'days').toISOString(), rawWhere = false, by = 'total' } = req.query;
  try {
    const { account: accountSegmentWhere, patient: segmentWhere } = (await Segment.convertOrFetch(rawWhere || segmentId || {}, req)); // eslint-disable-line

    // repeteable query object data
    const attributes = [[sequelize.fn('count', sequelize.col('Patient.id')), 'patientCount']];
    const monthAttributes = [[sequelize.fn('date_trunc', 'month', sequelize.col('Patient.createdAt')), 'date'], [sequelize.fn('count', sequelize.col('Patient.id')), 'patientCount']];
    const monthGroup = ['appointments->practitioner.id', sequelize.fn('date_trunc', 'month', sequelize.col('Patient.createdAt'))];

    let totalActivePatients = 0;
    let totalHygienePatients = 0;
    let totalNewPatients = 0;

    accountSegmentWhere.enterpriseId = req.enterpriseId;

    // fetch all enterprise accounts
    const accounts = await Account.findAll({
      raw: true,
      where: accountSegmentWhere,
    });
    const mappedAccounts = {};
    const accountIds = [];
    accounts.forEach((account) => {
      accountIds.push(account.id);
      mappedAccounts[account.id] = account;
    });

    const practitionersRaw = await Practitioner.findAll({
      raw: true,
      where: {
        accountId: accountIds,
      },
    });

    const practitioners = {};
    const practitionerIds = [];
    practitionersRaw.forEach((practitioner) => {
      practitionerIds.push(practitioner.id);
      practitioners[practitioner.id] = practitioner;
      practitioners[practitioner.id].account = mappedAccounts[practitioner.acountId];
      // set base for active patients
      practitioners[practitioner.id].activePatients = {
        total: 0,
        month: [],
      };

      // set base for hygiene patients
      practitioners[practitioner.id].hygienePatients = {
        total: 0,
        month: [],
      };

      // set base for new patients
      practitioners[practitioner.id].newPatients = {
        total: 0,
        month: [],
      };
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

    const activePatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere };

    // @TODO should be changed in future
    const hygieneInclude = [
      {
        attributes: [],
        model: Appointment,
        as: 'appointments',
        required: true,
        include: [
          {
            attributes: ['id'],
            model: Practitioner,
            as: 'practitioner',
            required: true,
            where: {
              type: Practitioner.TYPE.HYGIENIST,
              id: practitionerIds,
            },
          },
        ],
      },
    ];

    const activePatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      include: hygieneInclude,
      group: ['appointments->practitioner.id'],
    });

    const activePatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: monthAttributes,
      where: activePatientsWhere,
      include: hygieneInclude,
      group: monthGroup,
    });

    // fetch new patients (E.g. created at between start/end date)
    const newPatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere, ...dateWhere };
    const newPatientsData = await Patient.findAll({
      raw: true,
      attributes,
      where: newPatientsWhere,
      include: hygieneInclude,
      group: ['appointments->practitioner.id'],
    });

    const newPatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: monthAttributes,
      where: newPatientsWhere,
      include: hygieneInclude,
      group: monthGroup,
    });

    const hygienePatients = await Patient.findAll({
      raw: true,
      attributes,
      where: activePatientsWhere,
      include: hygieneInclude,
      group: ['appointments->practitioner.id'],
    });

    const hygienePatientsByMonth = await Patient.findAll({
      raw: true,
      attributes: monthAttributes,
      where: activePatientsWhere,
      include: hygieneInclude,
      group: monthGroup,
    });

    // Prepare and map data
    activePatientsData.forEach((practitioner) => {
      const patients = parseInt(practitioner.patientCount, 10);
      practitioners[practitioner['appointments.practitioner.id']].activePatients.total = patients;
      totalActivePatients += patients;
    });

    activePatientsByMonth.forEach((month) => {
      practitioners[month['appointments.practitioner.id']].activePatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });

    hygienePatients.forEach((practitioner) => {
      const patients = parseInt(practitioner.patientCount, 10);
      practitioners[practitioner['appointments.practitioner.id']].hygienePatients.total = patients;
      totalHygienePatients += patients;
    });

    hygienePatientsByMonth.forEach((month) => {
      practitioners[month['appointments.practitioner.id']].hygienePatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });

    newPatientsData.forEach((practitioner) => {
      const patients = parseInt(practitioner.patientCount, 10);
      practitioners[practitioner['appointments.practitioner.id']].newPatients.total = patients;
      totalNewPatients += patients;
    });

    newPatientsByMonth.forEach((month) => {
      practitioners[month['appointments.practitioner.id']].newPatients.month.push({
        date: month.date,
        number: month.patientCount,
      });
    });


    const dashboardData = {
      entities: {
        enterpriseDashboard: {
          patients: {
            id: 'patients',
            practitioners,
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
