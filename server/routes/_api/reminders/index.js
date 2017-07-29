import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import { sequelizeLoader } from '../../util/loaders';
import normalize from '../normalize';
import { Reminder } from '../../../_models';
import { StatusError } from '../../../util/StatusError';

const remindersRouter = Router();

remindersRouter.param('accountId', sequelizeLoader('account', 'Account'));
remindersRouter.param('reminderId', sequelizeLoader('reminder', 'Reminder'));

/**
 * GET /:accountId/reminders
 */
remindersRouter.get('/:accountId/reminders', checkPermissions('accounts:read'), async (req, res, next) => {
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }
  console.log('going to try');
  try {
    const reminders = await Reminder.findAll({
      raw: true,
      where: { accountId: req.accountId },
    });
    console.log(reminders);
    res.send(normalize('reminders', reminders));
  } catch (error) {
    next(error);
  }

});

module.exports = remindersRouter;
