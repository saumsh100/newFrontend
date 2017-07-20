
import { Router } from 'express';
import { pick } from 'lodash';
import moment from 'moment';
import { r } from '../../../config/thinky';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Enterprise, Account, User, Service, WeeklySchedule, Reminder, Recall, Patient, Appointment, Practitioner } from '../../../models';
import loaders from '../../util/loaders';
import { UserAuth } from '../../../lib/auth';

const { timeWithZone } = require('../../../util/time');

const router = Router();

router.param('enterpriseId', loaders('enterprise', 'Enterprise'));
router.param('accountId', loaders('account', 'Account'));

router.get('/', checkPermissions('enterprises:read'), (req, res, next) => {
  Enterprise.run()
    .then(enterprises => res.send(normalize('enterprises', enterprises)))
    .catch(next);
});

router.post('/', checkPermissions('enterprises:create'), (req, res, next) => {
  Enterprise.save(pick(req.body, ['name', 'plan']))
    .then(enterprise => res.send(201, normalize('enterprise', enterprise)))
    .catch(next);
});

router.post('/switch', checkPermissions('enterprises:read'), (req, res, next) => {
  const { userId, body: { enterpriseId }, sessionData, sessionId } = req;
  Account.filter({ enterpriseId }).run()
    .then(([{ id: accountId }]) => User.get(userId).then(user => user.merge({
      enterpriseId,
      activeAccountId: accountId,
    }).save()).then(() => UserAuth.updateSession(sessionId, sessionData, { accountId, enterpriseId })
          .then(({ id: newSessionId }) => UserAuth.signToken({
            userId: sessionData.userId,
            sessionId: newSessionId,
            activeAccountId: accountId,
          }))
      )
    )
    .then(token => res.json({ token }))
    .catch(next);
});

router.get('/dashboard/patients', checkPermissions('patients:read'), async (req, res, next) => {
  const from = r.ISO8601((req.params.from ? moment(req.params.from) : moment().startOf('year')).toISOString());
  const to = r.ISO8601((req.params.to ? moment(req.params.to) : moment()).toISOString());
  const enterpriseId = req.enterpriseId;

  try {
    const enterpriseAccounts = await Account.getAll(enterpriseId, { index: 'enterpriseId' });

    const accounts = {};
    let totalNewPatients = 0;
    let totalActivePatients = 0;
    let totalHygienePatients = 0;
    for (let i = 0; i < enterpriseAccounts.length; i += 1) {
      accounts[enterpriseAccounts[i].id] = {
        name: enterpriseAccounts[i].name,
      };

      // Get the new patients
      accounts[enterpriseAccounts[i].id].newPatients = (
        await Patient.between(
          ['Active', enterpriseAccounts[i].id, from],
          ['Active', enterpriseAccounts[i].id, to],
          { index: 'accountStatusPatients' }
        ).run()
      ).length;

      // Get the active patients
      accounts[enterpriseAccounts[i].id].activePatients = (
        await Patient.between(
          ['Active', enterpriseAccounts[i].id, r.minval],
          ['Active', enterpriseAccounts[i].id, to],
          { index: 'accountStatusPatients' }
        ).run()
      ).length;

      // Get the hygienists
      const accountHygienists = (
        await Practitioner.getAll(
          [enterpriseAccounts[i].id, 'Hygienist'],
          { index: 'accountAndType' })
        ).map((practitioner => practitioner.id)
      );
      
      // Get the hygyene patients
      const hygienePatients = [];
      for (let j = 0; j < accountHygienists.length; j += 1) {
        hygienePatients.push(
          ...await Appointment.between(
            [accountHygienists[j], from],
            [accountHygienists[j], to],
            { index: 'practitionerIdRange' }
          )
        );
      }
      
      accounts[enterpriseAccounts[i].id].hygyenePatients = new Set(
        hygienePatients.map(hp => hp.patientId)
      ).size;

      totalNewPatients += accounts[enterpriseAccounts[i].id].newPatients;
      totalActivePatients += accounts[enterpriseAccounts[i].id].activePatients;
      totalHygienePatients += accounts[enterpriseAccounts[i].id].hygyenePatients;
    }
    res.send({
      entities: {
        enterpriseDashboard: {
          patients: {
            id: 'patients',
            clinics: accounts,
            totals: {
              activePatients: totalActivePatients,
              hygienePatients: totalHygienePatients,
              newPatients: totalNewPatients,
            },
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:enterpriseId', checkPermissions('enterprises:read'), (req, res) => {
  res.send(normalize('enterprise', req.enterprise));
});

router.put('/:enterpriseId', checkPermissions('enterprises:update'), (req, res, next) => {
  req.enterprise.merge(pick(req.body, ['name', 'plan'])).save()
    .then(enterprise => res.send(normalize('enterprise', enterprise)))
    .catch(next);
});

router.delete('/:enterpriseId', checkPermissions('enterprises:delete'), (req, res, next) => {
  req.enterprise.delete()
    .then(() => res.sendStatus(204))
    .catch(next);
});

router.get('/:enterpriseId/accounts', checkPermissions(['enterprises:read', 'accounts:read']), (req, res, next) => {
  Account.filter({ enterpriseId: req.enterprise.id }).run()
    .then(accounts => res.send(normalize('accounts', accounts)))
    .catch(next);
});


router.post('/:enterpriseId/accounts', checkPermissions(['enterprises:read', 'accounts:update']), (req, res, next) => {
  const accountData = {
    ...pick(req.body, 'name', 'timezone'),
    enterpriseId: req.enterprise.id,
  };

  const timezone = req.body.timezone;

  Account.save(accountData)
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

      const defaultRecalls = [
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
        Reminder.save(defaultReminders),
        WeeklySchedule.save(defaultSchdedule),
        Service.save(defaultServices),
        Recall.save(defaultRecalls),
      ]).then((values) => {
        account.merge({ weeklyScheduleId: values[1].id }).save()
        .then(() => res.send(201, normalize('account', account)));
      });
    })
    .catch(next);
});

router.put(
  '/:enterpriseId/accounts/:accountId',
  checkPermissions(['enterprises:read', 'accounts:update']),
  (req, res, next) => {
    req.account.merge(pick(req.body, ['name'])).save()
      .then(account => res.send(normalize('account', account)))
      .catch(next);
  }
);

router.delete(
  '/:enterpriseId/accounts/:accountId',
  checkPermissions(['enterprises:read', 'accounts:delete']),
  (req, res, next) => {
    req.account.delete()
      .then(() => res.sendStatus(204))
      .catch(next);
  }
);

export default router;
