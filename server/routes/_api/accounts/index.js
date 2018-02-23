
import moment from 'moment';
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { UserAuth } from '../../../lib/_auth';
import { twilioDelete, callRailDelete, vendastaDelete } from '../../../lib/deleteAccount';
import { callRail, twilioSetup, vendastaFullSetup } from '../../../lib/createAccount';
import { getAccountConnectorConfigurations, updateAccountConnectorConfigurations } from '../../../lib/accountConnectorConfigurations';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import format from '../../util/format';
import { getDayStart, getDayEnd } from '../../../util/time';
import StatusError from'../../../util/StatusError';
import {
  Account,
  Enterprise,
  Invite,
  Permission,
  User,
  AccountConfiguration,
  Configuration,
} from '../../../_models';
import upload from '../../../lib/upload';
import { getReviewPatients, generateReviewsOutbox } from '../../../lib/reviews/helpers';
import { sequelizeLoader } from '../../util/loaders';
import { namespaces } from '../../../config/globals';
import { renderTemplate, generateClinicMergeVars } from '../../../lib/mail';

const accountsRouter = Router();

accountsRouter.param('accountId', sequelizeLoader('account', 'Account'));
accountsRouter.param('joinAccountId', sequelizeLoader('account', 'Account', [{ model: Enterprise, as: 'enterprise' }]));
accountsRouter.param('inviteId', sequelizeLoader('invite', 'Invite'));
accountsRouter.param('permissionId', sequelizeLoader('permission', 'Permission'));

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
accountsRouter.get('/', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const { accountId, role, enterpriseRole, enterpriseId, sessionData } = req;
    // Fetch all if correct role, just fetch current account if not
    let accounts;

    if (role === 'SUPERADMIN') {
      // Return all accounts...
      const accountsFind = await Account.findAll({ });
      accounts = accountsFind.map(a => a.get({ plain: true }));
    } else if (enterpriseRole === 'OWNER') {
      // Return all accounts under enterprise
      const accountsFind = await Account.findAll({
        where: { enterpriseId },
      });

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
});

/**
 * GET /:accountId/logo
 *
 * - Upload a accounts's logo
 */
accountsRouter.post('/:accountId/logo', checkPermissions('accounts:update'), async (req, res, next) => {
  // TODO: there are no tests for this, easy route to change
  const fileKey = `logos/${req.account.id}/${uuid.v4()}_[size]_${req.files.file.name}`;
  try {
    await upload(fileKey, req.files.file.data);

    req.account.logo = fileKey;
    const savedAccount = await req.account.update({ logo: fileKey });

    return res.send(normalize('account', savedAccount.get({ plain: true })));
  } catch (error) {
    return next(error);
  }
});

/**
 * DELETE /:accountId/logo
 *
 * - remove the account logo
 */
accountsRouter.delete('/:accountId/logo', checkPermissions('accounts:update'), async (req, res, next) => {
  try {
    req.account.logo = null;
    const savedAccount = await req.account.save();
    res.send(normalize('account', savedAccount.get({ plain: true })));
  } catch (error) {
    next(error);
  }
});

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
  return Permission.findOne({ where: { id: permissionId } })
    .then(permission => (permission || (role === 'SUPERADMIN')) || Promise.reject(StatusError(403, 'User don\'t have permissions for this account.')))
    .then(() => UserAuth.updateSession(sessionId, sessionData, { accountId }))
    // TODO: do we need to do a newSession.id?
    .then(newSession => UserAuth.signToken({
      userId: modelId,
      activeAccountId: accountId,
      sessionId: newSession.id,
    }))
    .then(signedToken => res.json({ token: signedToken }))
    .catch(next);
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
      account = await apiFunctionsCreate[integrations[i].type](account, integrations[i]);
    }
  } catch (e) {
    console.log(e)
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
    console.log(e)
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
accountsRouter.get('/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const configs = await getAccountConnectorConfigurations(req.accountId);

    return res.send(format(req, res, 'configurations', configs));
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /:accountId/configurations
 *
 * - get connector configuration settings.
 *
 */
accountsRouter.get('/:accountId/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    if (!req.account) {
      return req.sendStatus(404);
    }
    const configs = await getAccountConnectorConfigurations(req.account.id);

    return res.send(format(req, res, 'configurations', configs));
  } catch (err) {
    return next(err);
  }
});



/**
 * GET /:accountId
 *
 * - get basic account data
 *
 */
accountsRouter.get('/:accountId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const {
    includeArray,
  } = req;

  // TODO: need to add joinObject mapping to include...

  // Loader will handle 404
  return Account.findOne({ where: { id: req.account.id }, include: includeArray })
    .then(account => res.send(normalize('account', account.get({ plain: true }))))
    .catch(next);
});

/**
 * PUT /:accountId/configurations
 *
 * - Update connector configuration settings.
 *
 */
accountsRouter.put('/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const io = req.app.get('socketio');

    const config = await updateAccountConnectorConfigurations(req.body, req.accountId, io);

    return res.send(format(req, res, 'configuration', config));
  } catch (err) {
    return next(err);
  }
});

/**
 * PUT /:accountId/configurations
 *
 * - Update connector configuration settings.
 *
 */
accountsRouter.put('/:accountId/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    const io = req.app.get('socketio');

    const config = await updateAccountConnectorConfigurations(req.body, req.account.id, io);

    return res.send(format(req, res, 'configuration', config));
  } catch (err) {
    return next(err);
  }
});


/**
 * POST /:accountId/newUser
 *
 * - add user to account
 *
 */
accountsRouter.post('/:joinAccountId/newUser', (req, res, next) => {
  if (req.role !== 'SUPERADMIN') {
    return next(StatusError(403, 'requesting user does not have permission to change user role/permissions'));
  }

  if ((req.account.id !== req.accountId) && req.role !== 'SUPERADMIN') {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  return Permission.create({ role: req.body.role })
    .then((permission) => {
      return UserAuth.signup({
        ...req.body,
        username: req.body.email,
        activeAccountId: req.account.id,
        enterpriseId: req.account.enterprise.id,
        permissionId: permission.id,
      }).then(({ model: user }) => {
        return User.findOne({
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
        });
      });
    })
    .catch(next);
});

/**
 * PUT /:accountId
 *
 * - update clinic account data
 */
accountsRouter.put('/:accountId', checkPermissions('accounts:update'), (req, res, next) => {
  return req.account.update(req.body)
    .then(account => res.send(normalize('account', account.get({ plain: true }))))
    .catch(next);
});

/**
 * GET /:accountId/users
 *
 * - get all of the user's in the clinic
 */
accountsRouter.get('/:joinAccountId/users', (req, res, next) => {
  return User.findAll({
      //raw: true,
      include: [{ model: Permission, as: 'permission' }],
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
      obj.entities.accounts = {
        [account.id]: account,
      };

      res.send(obj);
    })
    .catch(next);
});

/**
 * GET /:accountId/reviews/list DEPRECATED
 *
 * - gets the reviews list
 */
accountsRouter.get('/:accountId/reviews/list', async (req, res, next) => {
  try {
    const date = (new Date()).toISOString();

    // Get the review appointments and filter out
    const data = await getReviewPatients({ date, account: req.account });

    res.send(data);
  } catch (err) {
    console.log(err);
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
    const outboxList = await generateReviewsOutbox({ account, startDate, endDate });
    res.send(outboxList);
  } catch (error) {
    next(error);
  }
});


/**
 * GET /:accountId/reviews/preview
 *
 * - purpose of this route is mainly for email templates as we have to go to mandrill
 */
accountsRouter.get('/:accountId/reviews/preview', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    if (req.accountId !== req.account.id) {
      return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
    }

    const { account } = req;
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    const templateName = 'Patient Review';

    const html = await renderTemplate({
      templateName,
      mergeVars: generateClinicMergeVars({ account, patient }),
    });

    return res.send(html);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = accountsRouter;

