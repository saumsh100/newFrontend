

import moment from 'moment';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Account, Invite, User, Enterprise } from '../../../_models';
import { sendInvite } from '../../../lib/inviteMail';
import StatusError from '../../../util/StatusError';

const uuid = require('uuid').v4;
const invitesRouter = Router();

invitesRouter.param('accountId', sequelizeLoader('account', 'Account', [{ model: Enterprise, as: 'enterprise' }]));
invitesRouter.param('inviteId', sequelizeLoader('invite', 'Invite'));

/**
 * GET /:accountId/invites
 *
 * - get all of the account's user invites
 */
invitesRouter.get('/:accountId/invites', (req, res, next) => {
  const { accountId } = req;

  return Invite.findAll({
    raw: true,
    where: {
      accountId,
      isDeleted: false,
    },
  }).then((invites) => {
    res.send(normalize('invites', invites));
  }).catch(next);
});

/**
 * POST /:accountId/invites
 *
 * - create a user invite for the account
 */
invitesRouter.post('/:accountId/invites', async (req, res, next) => {
  // Override accountId, and add token
  const newInvite = req.body;
  newInvite.accountId = req.accountId;
  newInvite.token = uuid();
  newInvite.enterpriseId = req.account.enterprise.id;

  const checkEmail = await Invite.findAll({
    where: {
      email: newInvite.email,
    },
  });

  if (checkEmail[0]) {
    return res.sendStatus(400);
  }

  return Invite.create(newInvite)
    .then((inviteData) => {
      const invite = inviteData.dataValues;

      const fullUrl = `${req.protocol}://${req.get('host')}/signupinvite/${invite.token}`;
      User.findAll({
        where: {
          id: invite.sendingUserId,
        },
        raw: true,
      })
        .then((user) => {
          const mergeVars = [
            {
              name: 'URL',
              content: fullUrl,
            },
            {
              name: 'NAME',
              content: `${user[0].firstName} ${user[0].lastName}`,
            },
            {
              name: 'CURRENT_YEAR',
              content: moment().format('YYYY'),
            },
          ];

          sendInvite({
            subject: 'Test',
            toEmail: invite.email,
            mergeVars,
          });

          res.send(normalize('invite', invite));
        });
    })
    .catch(next);
});

/**
 * DELETE /:accountId/invites/:inviteId
 *
 * - cancel a user invitation
 *
 */
invitesRouter.delete('/:accountId/invites/:inviteId', (req, res, next) => {
  // make sure requesting user is trying to delete invites for his account
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  // Make sure the invite is owned by the account
  if (req.invite.accountId !== req.account.id) {
    return next(StatusError(403, `Cannot delete invites that are not owned by the acccount with id: ${req.account.id}`));
  }

  return req.invite.destroy()
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = invitesRouter;
