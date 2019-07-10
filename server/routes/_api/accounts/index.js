
import moment from 'moment';
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { getDayStart, getDayEnd, formatPhoneNumber } from '@carecru/isomorphic';
import {
  Account,
  Enterprise,
  Permission,
  User,
  WeeklySchedule,
} from 'CareCruModels';
import uniqBy from 'lodash/uniqBy';
import { apiServerUrl } from '../../../config/globals';
import { UserAuth } from '../../../lib/_auth';
import { callRailDelete, vendastaDelete } from '../../../lib/deleteAccount';
import { callRail, vendastaFullSetup } from '../../../lib/createAccount';
import {
  twilioSetup,
  twilioDelete,
} from '../../../lib/thirdPartyIntegrations/twilio';
import {
  getAccountConnectorConfigurations,
  updateAccountConnectorConfigurations,
} from '../../../lib/accountConnectorConfigurations';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import format from '../../util/format';
import StatusError from '../../../util/StatusError';
import upload from '../../../lib/upload';
import {
  getReviewPatients,
  generateReviewsOutbox,
} from '../../../lib/reviews/helpers';
import { sequelizeLoader } from '../../util/loaders';
import {
  renderTemplate,
  generateClinicMergeVars,
  sendMassGeneralIntroAnnouncement,
} from '../../../lib/mail';
import {
  getPatientsWithAppInRange,
  countPatientsWithAppInRange,
} from '../../../lib/patientsQuery/patientsWithinRange';
import {
  createOfficeHour,
  modifyOfficeHour,
  deleteOfficeHour,
} from './officeHour';
import { deleteIsClosedFieldFromBody } from '../../../_models/WeeklySchedule';
import generateDailyHoursForPractice from '../../../lib/schedule/generateDailyHoursForPractice';
import { getMessageFromTemplates } from '../../../services/communicationTemplate';
import sendReminder from '../../../lib/reminders/sendReminder';
import connectorWatch from '../../../lib/connectorWatch';

const accountsRouter = Router();

accountsRouter.param('accountId', sequelizeLoader('account', 'Account'));
accountsRouter.param(
  'joinAccountId',
  sequelizeLoader('account', 'Account', [
    {
      model: Enterprise,
      as: 'enterprise',
    },
  ]),
);
accountsRouter.param('inviteId', sequelizeLoader('invite', 'Invite'));
accountsRouter.param(
  'permissionId',
  sequelizeLoader('permission', 'Permission'),
);
accountsRouter.param('name', sequelizeLoader('configuration', 'Configuration'));

const apiFunctionsCreate = {
  twilio: twilioSetup,
  callrail: callRail,
  vendasta: vendastaFullSetup,
};

const apiFunctionsDelete = {
  twilio: twilioDelete,
  callrail: callRailDelete,
  vendasta: vendastaDelete,
};

/**
 * GET /
 *
 * - list of accounts in an enterprise
 * - must be a SUPERADMIN or OWNER to list all
 * - if not, it just lists the one
 */
accountsRouter.get(
  '/',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      const { accountId, role, enterpriseId } = req;
      // Fetch all if correct role, just fetch current account if not
      let accounts;

      if (role === 'SUPERADMIN') {
        // Return all accounts...
        const accountsFind = await Account.findAll({});
        accounts = accountsFind.map(a => a.get({ plain: true }));
      } else if (role === 'OWNER') {
        // Return all accounts under enterprise
        const accountsFind = await Account.findAll({ where: { enterpriseId } });
        accounts = accountsFind.map(a => a.get({ plain: true }));
      } else {
        // Return single account
        const accountsFind = await Account.findOne({
          where: { id: accountId },
        });

        accounts = [accountsFind.get({ plain: true })];
      }

      res.send(normalize('accounts', accounts));
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /:accountId/logo
 *
 * - Upload a accounts's logo
 */
accountsRouter.post(
  '/:accountId/logo',
  checkPermissions('accounts:update'),
  async (req, res, next) => {
    // TODO: there are no tests for this, easy route to change
    const fileKey = `logos/${req.account.id}/${uuid.v4()}_[size]_${
      req.files.file.name
    }`;
    try {
      await upload(fileKey, req.files.file.data);

      req.account.logo = fileKey;
      const savedAccount = await req.account.update({ logo: fileKey });

      return res.send(normalize('account', savedAccount.get({ plain: true })));
    } catch (error) {
      return next(error);
    }
  },
);

/**
 * DELETE /:accountId/logo
 *
 * - remove the account logo
 */
accountsRouter.delete(
  '/:accountId/logo',
  checkPermissions('accounts:update'),
  async (req, res, next) => {
    try {
      req.account.logo = null;
      const savedAccount = await req.account.save();
      res.send(normalize('account', savedAccount.get({ plain: true })));
    } catch (error) {
      next(error);
    }
  },
);

/**
 * POST /:accountId/switch
 *
 * - only superadmins are allowed to switch into accounts right now...
 *
 */
accountsRouter.post('/:accountId/switch', (req, res, next) => {
  const { account, role, sessionId, permissionId, userId, sessionData } = req;
  if (role !== 'SUPERADMIN' && role !== 'OWNER' && role !== 'ADMIN') {
    return next(StatusError(403, 'Operation not permitted'));
  }

  const accountId = account.id;
  const modelId = userId;

  // User.hasOne(permission)
  return (
    Permission.findOne({ where: { id: permissionId } })
      .then(
        permission =>
          permission ||
          role === 'SUPERADMIN' ||
          role === 'OWNER' ||
          Promise.reject(
            StatusError(403, "User don't have permissions for this account."),
          ),
      )
      .then(async () => {
        const { enterpriseId } = await Account.findById(accountId, {
          raw: true,
        });
        await User.update(
          {
            enterpriseId,
            activeAccountId: accountId,
          },
          {
            where: { id: userId },
          },
        );
        return enterpriseId;
      })
      .then(enterpriseId =>
        UserAuth.updateSession(sessionId, sessionData, {
          accountId,
          enterpriseId,
        }))
      // TODO: do we need to do a newSession.id?
      .then(newSession =>
        UserAuth.signToken({
          userId: modelId,
          activeAccountId: accountId,
          sessionId: newSession.id,
        }))
      .then(signedToken => res.json({ token: signedToken }))
      .catch(next)
  );
});

/**
 * POST /:accountId/switch
 *
 * - only superadmins are allowed to switch into accounts right now...
 *
 */
accountsRouter.post('/:accountId/integrations', async (req, res, next) => {
  let { account } = req;
  const { integrations } = req.body;

  try {
    for (let i = 0; i < integrations.length; i += 1) {
      account = await apiFunctionsCreate[integrations[i].type](
        account,
        integrations[i],
      );
    }
  } catch (e) {
    console.error(e);
  }
  // if (role !== 'SUPERADMIN') {
  //   return next(StatusError(403, 'Operation not permitted'));
  // }
  // await vendastaDelete(req.account);
  return res.send(normalize('account', account.get({ plain: true })));
});

/**
 * POST /:accountId/switch
 *
 * - only superadmins are allowed to switch into accounts right now...
 *
 */
accountsRouter.delete('/:accountId/integrations', async (req, res, next) => {
  let { account } = req;
  const integrations = req.query.integrations;

  try {
    for (let i = 0; i < integrations.length; i += 1) {
      const data = JSON.parse(integrations[i]);
      account = await apiFunctionsDelete[data.type](account, data);
    }
  } catch (e) {
    console.error(e);
  }
  // if (role !== 'SUPERADMIN') {
  //   return next(StatusError(403, 'Operation not permitted'));
  // }
  // await vendastaDelete(req.account);
  return res.send(normalize('account', account.get({ plain: true })));
});

/**
 * GET /configurations
 *
 * - get connector configuration settings.
 *
 */
accountsRouter.get(
  '/configurations',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      const configs = await getAccountConnectorConfigurations(req.accountId);

      return res.send(format(req, res, 'configurations', configs));
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * GET /:accountId/configurations
 *
 * - get connector configuration settings.
 *
 */
accountsRouter.get(
  '/:accountId/configurations',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      if (!req.account) {
        return req.sendStatus(404);
      }
      const configs = await getAccountConnectorConfigurations(req.account.id);

      return res.send(format(req, res, 'configurations', configs));
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * GET /:accountId
 *
 * - get basic account data
 *
 */
accountsRouter.get(
  '/:accountId',
  checkPermissions('accounts:read'),
  (req, res, next) => {
    if (req.account.id !== req.accountId) {
      return next(
        StatusError(403, 'req.accountId does not match URL account id'),
      );
    }

    const { includeArray } = req;

    // TODO: need to add joinObject mapping to include...

    // Loader will handle 404
    return Account.findOne({
      where: { id: req.account.id },
      include: includeArray,
    })
      .then(account =>
        res.send(normalize('account', account.get({ plain: true }))))
      .catch(next);
  },
);

/**
 * PUT /:accountId/configurations
 *
 * - Update connector configuration settings.
 *
 */
accountsRouter.put(
  '/configurations',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      const io = req.app.get('socketio');

      const config = await updateAccountConnectorConfigurations(
        req.body,
        req.accountId,
        io,
      );

      return res.send(format(req, res, 'configuration', config));
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * PUT /:accountId/configurations
 *
 * - Update connector configuration settings.
 *
 */
accountsRouter.put(
  '/:accountId/configurations',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      const io = req.app.get('socketio');

      const config = await updateAccountConnectorConfigurations(
        req.body,
        req.account.id,
        io,
      );

      return res.send(format(req, res, 'configuration', config));
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * POST /:accountId/newUser
 *
 * - add user to account
 *
 */
accountsRouter.post('/:joinAccountId/newUser', (req, res, next) => {
  if (req.role !== 'SUPERADMIN') {
    return next(
      StatusError(
        403,
        'requesting user does not have permission to change user role/permissions',
      ),
    );
  }

  if (req.account.id !== req.accountId && req.role !== 'SUPERADMIN') {
    return next(
      StatusError(403, 'req.accountId does not match URL account id'),
    );
  }

  return Permission.create({ role: req.body.role })
    .then(permission =>
      UserAuth.signup({
        ...req.body,
        username: req.body.email,
        activeAccountId: req.account.id,
        enterpriseId: req.account.enterprise.id,
        permissionId: permission.id,
      }).then(({ model: user }) =>
        User.findOne({
          where: { id: user.dataValues.id },
          include: [
            {
              model: Permission,
              as: 'permission',
            },
          ],
          raw: true,
          nest: true,
        }).then((userSend) => {
          delete userSend.password;
          return res.status(201).send(normalize('user', userSend));
        })))
    .catch(next);
});

/**
 * PUT /:accountId
 *
 * - update clinic account data
 */
accountsRouter.put(
  '/:accountId',
  checkPermissions('accounts:update'),
  (req, res, next) =>
    req.account
      .update(req.body)
      .then(account =>
        res.send(normalize('account', account.get({ plain: true }))))
      .catch(next),
);

/**
 * GET /:accountId/users
 *
 * - get all of the user's in the clinic
 */
accountsRouter.get('/:joinAccountId/users', (req, res, next) =>
  User.findAll({
    // raw: true,
    include: [
      {
        model: Permission,
        as: 'permission',
      },
    ],
    where: {
      enterpriseId: req.account.enterprise.id,
      // TODO: i don't think this should be there...
      activeAccountId: req.account.id,
    },
  })
    .then((users) => {
      users = users.filter(user => user.permission.role !== 'SUPERADMIN');
      users = users.map(u => u.get({ plain: true }));
      const obj = normalize('users', users);

      const account = req.account.dataValues;
      delete account.enterprise;
      obj.entities.accounts = { [account.id]: account };

      res.send(obj);
    })
    .catch(next));

/**
 * GET /:accountId/reviews/list DEPRECATED
 *
 * - gets the reviews list
 */
accountsRouter.get('/:accountId/reviews/list', async (req, res, next) => {
  try {
    const date = new Date().toISOString();

    // Get the review appointments and filter out
    const data = await getReviewPatients({
      date,
      account: req.account,
    });

    res.send(data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * GET /:accountId/reviews/outbox
 *
 * - gets the reviews outbox for a certain time range
 * - will default to beginning and end of current day if not supplied
 */
accountsRouter.get('/:accountId/reviews/outbox', async (req, res, next) => {
  try {
    const { account } = req;
    const { startDate = getDayStart(), endDate = getDayEnd() } = req.query;
    const outboxList = await generateReviewsOutbox({
      account,
      startDate,
      endDate,
    });
    res.send(outboxList);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /:accountId/emails/preview
 *
 * - purpose of this route is mainly for email templates as we have to go to mandrill
 */
accountsRouter.get(
  '/:accountId/emails/preview',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      if (req.accountId !== req.account.id) {
        return next(
          StatusError(
            403,
            "Requesting user's activeAccountId does not match account.id",
          ),
        );
      }

      const { account } = req;
      const { templateName } = req.query;

      const patient = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      const accountId = account.id;
      const parameters = {};
      const [
        reviewsEmailCta,
        starSubtext1,
        starSubtext3,
        starSubtext5,
      ] = await Promise.all([
        getMessageFromTemplates(accountId, 'reviews-email-cta', parameters),
        getMessageFromTemplates(
          accountId,
          'reviews-email-1-star-subtext',
          parameters,
        ),
        getMessageFromTemplates(
          accountId,
          'reviews-email-3-star-subtext',
          parameters,
        ),
        getMessageFromTemplates(
          accountId,
          'reviews-email-5-star-subtext',
          parameters,
        ),
      ]);

      const html = await renderTemplate({
        templateName,
        mergeVars: [
          ...generateClinicMergeVars({ account,
            patient }),
          // Now add miscellaneous merge_vars only used by certain templates
          {
            name: 'REVIEW_REQUEST_CTA',
            content: reviewsEmailCta,
          },
          {
            name: 'STAR_SUBTEXT_1',
            content: starSubtext1,
          },
          {
            name: 'STAR_SUBTEXT_3',
            content: starSubtext3,
          },
          {
            name: 'STAR_SUBTEXT_5',
            content: starSubtext5,
          },
        ],
      });

      return res.send(html);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
);

/**
 * GET /:accountId/voice/preview
 *
 * - purpose of this route is mainly to preview robo-calls
 */
accountsRouter.get(
  '/:accountId/voice/preview',
  checkPermissions('accounts:read'),
  async (
    {
      account,
      query: { binName, cellPhoneNumber, startDateTime, familyMembersAndTimes = true },
    },
    res,
    next,
  ) => {
    try {
      const confirmAppointmentEndpoint = `${apiServerUrl}/twilio/voice/sentReminders/robocallPreview/confirmed`;

      await sendReminder.phone({
        account,
        appointment: { startDate: startDateTime },
        patient: { cellPhoneNumber },
        confirmAppointmentEndpoint,
        binName,
        familyMembersAndTimes,
      });

      res.send(`Calling ${cellPhoneNumber} about ${binName}`);
    } catch (err) {
      next(err);
    }
  },
);

/**
 *  POST: /:accountId/onlineBookingEmailBlast
 *
 *  - This route is to create and deliver an email campaign to all active patients
 *  of a clinic.
 */
accountsRouter.post(
  '/:accountId/onlineBookingEmailBlast',
  checkPermissions('accounts:update'),
  async (req, res, next) => {
    try {
      const { accountId } = req;

      const { startDate, endDate } = req.query;

      const patientFilters = { email: { $not: null } };

      const attributes = ['Patient.id', 'Patient.email', 'Patient.firstName'];

      const account = await Account.findById(accountId);
      const { name, massOnlineEmailSentDate } = account;

      const accountLogoUrl =
        typeof account.fullLogoUrl === 'string' &&
        account.fullLogoUrl.replace('[size]', 'original');

      if (massOnlineEmailSentDate) {
        return res.sendStatus(403);
      }

      const patients = await getPatientsWithAppInRange(
        accountId,
        patientFilters,
        startDate,
        endDate,
        attributes,
      );

      const filteredPatients = uniqBy(patients, 'email');

      const googlePlaceId = account.googlePlaceId
        ? `https://search.google.com/local/writereview?placeid=${
          account.googlePlaceId
        }`
        : null;

      res.sendStatus(200);

      console.log(
        `Email campaign initiated for ${filteredPatients.length} patients`,
      );

      const promises = filteredPatients.map(patient =>
        sendMassGeneralIntroAnnouncement({
          patientId: patient.id,
          accountId: req.accountId,
          toEmail: patient.email,
          fromName: name,
          replyTo: account.contactEmail,
          mergeVars: [
            {
              name: 'PRIMARY_COLOR',
              content: account.bookingWidgetPrimaryColor || '#206477',
            },
            {
              name: 'ACCOUNT_CLINICNAME',
              content: name,
            },
            {
              name: 'PATIENT_FIRSTNAME',
              content: patient.firstName,
            },
            {
              name: 'ACCOUNT_LOGO_URL',
              content: accountLogoUrl,
            },
            {
              name: 'ACCOUNT_PHONENUMBER',
              content: formatPhoneNumber(account.phoneNumber),
            },
            {
              name: 'ACCOUNT_TWILIONUMBER',
              content: account.twilioPhoneNumber,
            },
            {
              name: 'ACCOUNT_TWILIONUMBER_FORMATTED',
              content: formatPhoneNumber(account.twilioPhoneNumber),
            },
            {
              name: 'ACCOUNT_CITY',
              content: `${account.address.city}, ${account.address.state}`,
            },
            {
              name: 'ACCOUNT_CONTACTEMAIL',
              content: account.contactEmail,
            },
            {
              name: 'ACCOUNT_ADDRESS',
              content: account.address.street,
            },
            {
              name: 'BOOK_URL',
              content: `${account.website}/?cc=book`,
            },
            {
              name: 'FACEBOOK_URL',
              content: account.facebookUrl,
            },
            {
              name: 'GOOGLE_URL',
              content: googlePlaceId,
            },
          ],
        }).catch((err) => {
          console.error(
            `Failed to send General Intro email to ${patient.email}`,
          );
          console.error(err);
        }));

      const response = await Promise.all(promises);

      response.forEach((resp) => {
        if (resp && resp[0] && resp[0].status === 'rejected') {
          console.error(
            `Status Rejected. Failed to send General Intro email to ${
              resp[0].email
            }.`,
          );
        } else {
          console.log(`Sent General Intro email to ${resp[0].email}!`);
        }
      });

      return await req.account.update({
        massOnlineEmailSentDate: moment().toISOString(),
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
);

/**
 *  GET: /:accountId/onlineBookingEmailBlastCount
 *
 *  - This route is to get the count of patients that would receive the email blast.
 *
 */
accountsRouter.get(
  '/:accountId/onlineBookingEmailBlastCount',
  checkPermissions('accounts:read'),
  async (req, res, next) => {
    try {
      const { accountId } = req;

      const { startDate, endDate } = req.query;

      const patientFilters = { email: { $not: null } };

      const patientCount = await countPatientsWithAppInRange(
        accountId,
        patientFilters,
        startDate,
        endDate,
      );

      return res.send({ patientEmailCount: patientCount });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
);

/**
 * GET /:accountId/officeHour
 * This is the new end point for retrieving the office hour for an account.
 */
accountsRouter.get(
  '/:accountId/officeHour',
  async ({ account: { weeklyScheduleId, id } }, res, next) => {
    if (!weeklyScheduleId) {
      return next(
        new StatusError(
          StatusError.NOT_FOUND,
          `Account ${id} does not have office hour`,
        ),
      );
    }

    try {
      const weeklySchedule = await WeeklySchedule.findByPk(weeklyScheduleId);
      return res.send(weeklySchedule);
    } catch (e) {
      return next(e);
    }
  },
);

/**
 * POST /connector/officeHour
 * This is the end point for connector to create the office hour
 * since connector does not have the information about the accountId,
 * we need a separate endpoint for it.
 */
accountsRouter.post('/connector/officeHour', async (req, res, next) => {
  try {
    const { body: rawOfficeHour, accountId } = req;
    const account = await Account.findByPk(accountId);
    const weeklySchedule = await createOfficeHour({
      account,
      rawOfficeHour,
    });

    return res.send(format(req, res, 'weeklySchedule', weeklySchedule));
  } catch (e) {
    return next(e);
  }
});

/**
 * POST /:accountId/officeHour
 * This is the new end point for creating the office hour for an account.
 * The request body should include from 'mondaySchedule' to 'sundaySchedule'.
 */
accountsRouter.post(
  '/:accountId/officeHour',
  async ({ body: rawOfficeHour, account }, res, next) => {
    try {
      const weeklySchedule = await createOfficeHour({
        account,
        rawOfficeHour,
      });
      // do not need to normalize it
      // because the association already includes all the dailySchedule entities
      return res.send(weeklySchedule.get({ plain: true }));
    } catch (e) {
      return next(e);
    }
  },
);

/**
 * DELETE /connector/officeHour
 * This is the end point for connector to delete the office hour
 * since connector does not have the information about the accountId,
 * we need a separate endpoint for it.
 */
accountsRouter.delete(
  '/connector/officeHour',
  async ({ accountId }, res, next) => {
    try {
      const account = await Account.findByPk(accountId);
      await deleteOfficeHour(account);
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  },
);

/**
 * DELETE /:accountId/officeHour
 * This is the new end point for deleting the office hour for an account.
 */
accountsRouter.delete(
  '/:accountId/officeHour',
  async ({ account }, res, next) => {
    try {
      await deleteOfficeHour(account);
      return res.sendStatus(200);
    } catch (e) {
      return next(e);
    }
  },
);

/**
 * PUT /connector/officeHour
 * This is the end point for connector to modify the office hour
 * since connector does not have the information about the accountId,
 * we need a separate endpoint for it.
 */
accountsRouter.put('/connector/officeHour', async (req, res, next) => {
  try {
    const { body, accountId } = req;
    const rawOfficeHour = deleteIsClosedFieldFromBody(body);
    const account = await Account.findByPk(accountId);
    let { weeklyScheduleId } = account;

    /* Create the weeklySchedule if not exist for an account.
     * This is due to the fact that connector is ONLY use PUT method for both
     * creating and updating office hour.
     */
    if (!weeklyScheduleId) {
      const officeHour = await createOfficeHour({
        account,
        rawOfficeHour,
      });
      weeklyScheduleId = officeHour.get('id');
    } else {
      await modifyOfficeHour({
        weeklyScheduleId,
        accountId,
        rawOfficeHour,
      });
    }
    const weeklySchedule = await WeeklySchedule.findByPk(weeklyScheduleId);

    return res.send(format(req, res, 'weeklySchedule', weeklySchedule));
  } catch (e) {
    return next(e);
  }
});

/**
 * PUT /:accountId/officeHour
 * This is the new end point for updating the office hour for an account.
 * The request body should include from 'mondaySchedule' to 'sundaySchedule'.
 */
accountsRouter.put(
  '/:accountId/officeHour',
  async (
    { body: rawOfficeHour, account: { weeklyScheduleId, id: accountId } },
    res,
    next,
  ) => {
    try {
      await modifyOfficeHour({
        weeklyScheduleId,
        accountId,
        rawOfficeHour,
      });
      const weeklySchedule = await WeeklySchedule.findByPk(weeklyScheduleId);
      return res.send(weeklySchedule);
    } catch (e) {
      return next(e);
    }
  },
);

/**
 * GET /:accountId/finalDailySchedules
 * This generates the finalDailyHours for Practice.
 */
accountsRouter.get(
  '/:accountId/finalDailySchedules',
  async ({ account, query }, res, next) => {
    try {
      const { startDate, endDate } = query;
      const practiceSchedule = await generateDailyHoursForPractice({
        account,
        startDate,
        endDate,
      });

      return res.send(practiceSchedule);
    } catch (error) {
      return next(error);
    }
  },
);

/**
 * GET /connectorWatch
 * This triggers the connectorWatch.
 */
accountsRouter.get(
  '/connector/connectorWatch',
  async (req, res, next) => {
    try {
      await connectorWatch(global.io);
      return res.send("Done!");
    } catch (error) {
      return next(error);
    }
  },
);

export default accountsRouter;
