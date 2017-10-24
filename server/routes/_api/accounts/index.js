
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { UserAuth } from '../../../lib/_auth';
import { twilioDelete, callRailDelete, vendastaDelete } from '../../../lib/deleteAccount';
import { callRail, twilioSetup, vendastaFullSetup } from '../../../lib/createAccount';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import format from '../../util/format';
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
import { getReviewAppointments } from '../../../lib/reviews/helpers';
import { sequelizeLoader } from '../../util/loaders';
import { namespaces } from '../../../config/globals';

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

async function getAccountConnectorConfigurations(req, res, next, accountId) {
  try {
    const sendValues = [];
    const accountConfigs = await Configuration.findAll({
      raw: true,
      nest: true,
      include: {
        model: AccountConfiguration,
        as: 'accountConfiguration',
        where: {
          accountId,
        },

        required: false,
      },
    });

    for (let i = 0; i < accountConfigs.length; i += 1) {
      const sendValue = {
        name: accountConfigs[i].name,
        description: accountConfigs[i].description,
        'data-type': accountConfigs[i].type,
        value: accountConfigs[i].defaultValue,
        id: accountConfigs[i].id,
      };

      if (accountConfigs[i].accountConfiguration.id) {
        sendValue.value = accountConfigs[i].accountConfiguration.value;
      }

      sendValues.push(sendValue);
    }

    return res.send(format(req, res, 'configurations', sendValues));
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /configurations
 *
 * - get connector configuration settings.
 *
 */
accountsRouter.get('/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  return getAccountConnectorConfigurations(req, res, next, req.accountId);
});

/**
 * GET /:accountId/configurations
 *
 * - get connector configuration settings.
 *
 */
accountsRouter.get('/:accountId/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  return getAccountConnectorConfigurations(req, res, next, req.account.id);
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

async function updateAccountConnectorConfigurations(req, res, next, accountId) {
  try {
    const {
      name,
    } = req.body;

    const config = await Configuration.findOne({
      where: { name },
    });

    if (!config) {
      return res.sendStatus(400);
    }

    const checkConfigExists = await AccountConfiguration.findOne({
      where: {
        accountId,
        configurationId: config.id,
      },
    });

    let newConfig;

    if (checkConfigExists) {
      newConfig = await checkConfigExists.update(req.body);
    } else {
      newConfig = await AccountConfiguration.create({
        accountId,
        configurationId: config.id,
        ...req.body,
      });
    }

    const accountConfig = newConfig.get({ plain: true });

    const sendValue = {
      name,
      description: config.description,
      'data-type': config.type,
      value: accountConfig.value,
      id: newConfig.id,
    };

    const io = req.app.get('socketio');
    io.of(namespaces.sync).in(accountId).emit('CONFIG:REFRESH', name);

    return res.send(format(req, res, 'configuration', sendValue));
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /:accountId/configurations
 *
 * - Update connector configuration settings.
 *
 */
accountsRouter.put('/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  return updateAccountConnectorConfigurations(req, res, next, req.accountId);
});

/**
 * PUT /:accountId/configurations
 *
 * - Update connector configuration settings.
 *
 */
accountsRouter.put('/:accountId/configurations', checkPermissions('accounts:read'), async (req, res, next) => {
  return updateAccountConnectorConfigurations(req, res, next, req.account.id);
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
 * PUT /:accountId
 *
 * - update clinic account data
 */
accountsRouter.get('/:accountId/reviews/stats', checkPermissions('accounts:update'), async (req, res, next) => {
  try {
    const date = (new Date()).toISOString();

    // Get the review appointments and filter out
    const appts = await getReviewAppointments({ date, account: req.account });
    const noEmail = appts.filter(({ patient }) => !patient.email);

    res.send({
      success: appts.length - noEmail.length,
      fail: noEmail.length,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = accountsRouter;

