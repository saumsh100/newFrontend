
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { UserAuth } from '../../../lib/_auth';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import StatusError from'../../../util/StatusError';
import {
  Account,
  Address,
  Enterprise,
  Invite,
  Permission,
  User,
} from '../../../_models';
import upload from '../../../lib/upload';
import { sequelizeLoader } from '../../util/loaders';

const addressRouter = Router();

addressRouter.param('addressId', sequelizeLoader('address', 'Address'));

/**
 * POST /
 *
 * - Create address model
 */
addressRouter.post('/', checkPermissions('accounts:update'), async (req, res, next) => {
  // TODO: there are no tests for this, easy route to change
  const {
    accountId = null,
    patientId = null,
  } = req.body;

  try {
    if (accountId) {
      const newAddress = await Address.create(req.body);
      await Account.update({ addressId: newAddress.id }, { where: { id: accountId } });
      const sendAccount = await Account.findOne({
        where: {
          id: accountId,
        },
      });

      return res.status(201).send(normalize('account', sendAccount.get({ plain: true })));
    }
    // for now no patient address
    return res.sendStatus(400);
  } catch (error) {
    return next(error);
  }
});


/**
 * PUT /:addressId/
 *
 * - Update address model
 */
addressRouter.put('/:addressId', checkPermissions('accounts:update'), async (req, res, next) => {
  // TODO: there are no tests for this, easy route to change

  try {
    const newAddress = await req.address.update(req.body);
    return res.status(201).send(normalize('address', newAddress.get({ plain: true })));
  } catch (error) {
    return next(error);
  }
});


module.exports = addressRouter;


