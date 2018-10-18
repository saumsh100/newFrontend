
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../../_api/normalize';
import { twilioSetup, twilioDelete } from '../../../lib/thirdPartyIntegrations/twilio';

const setupRouter = Router();

setupRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * POST /:accountId/twilioPhoneNumber
 *
 * - create a new twilio phone number for a new account
 */
setupRouter.post('/:accountId/twilioPhoneNumber', async ({ account }, res, next) => {
  try {
    const updatedAccount = await twilioSetup(account);
    return res.send(normalize('account', updatedAccount.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/**
 * DELETE /:accountId/twilioPhoneNumber
 *
 * - delete the twilio phone number associated with an account
 */
setupRouter.delete('/:accountId/twilioPhoneNumber', async ({ account }, res, next) => {
  try {
    const updatedAccount = await twilioDelete(account);
    return res.send(normalize('account', updatedAccount.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

export default setupRouter;
