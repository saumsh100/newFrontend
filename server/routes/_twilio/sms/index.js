
import { Router } from 'express';
import { TextMessage } from 'CareCruModels';
import { sequelizeLoader } from '../../util/loaders';
import { receiveSMS } from '../../../services/sms';

const smsRouter = Router();

smsRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * Twilio SMS Webhook
 * - need to add twilio.webhook() when we separate environments on prod, staging and local
 */
smsRouter.post('/accounts/:accountId', async (req, res, next) => {
  try {
    console.log(`Received twilio message on /accounts/${req.account.id}`);
    await receiveSMS(req.account, req.body);
    // Twilio needs to have a certain type associated with the response
    res.type('xml');
    res.end();
  } catch (err) {
    next(err);
  }
});

// Receive all status updates to a message
smsRouter.post('/status', (req, res, next) => {
  const {
    MessageSid,
    MessageStatus,
  } = req.body;

  // Update that message with the new status
  TextMessage.findById(MessageSid).run()
    .then((textMessage) => {
      textMessage.update({ status: MessageStatus })
        .then(() => console.log(`Updated ${MessageSid} message to ${MessageStatus}!`))
        .catch(next);
    })
    .catch(next);

  // For twilio... needs a response
  res.end();
});

export default smsRouter;
