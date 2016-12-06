/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const twilioRouter = require('express').Router();
const TextMessage = require('../../models/TextMessage');
const thinky = require('../../config/thinky');

// Receive all incoming SMS traffic to the Twilio number
twilioRouter.post('/message', (req, res, next) => {
  const {
    To,
    From,
    Body,
    MessageSid,
  } = req.body;
  
  // TODO: Do we need to res.send on successful saving?
  TextMessage.save({
    id: MessageSid,
    to: To,
    from: From,
    message: Body,
    createdAt: thinky.r.now(), // TODO: fix unnecessary writing, fix defaults...
  });
  
  // For twilio... needs a response
  res.send();
});

// Receive all status updates to a message
twilioRouter.post('/status', (req, res, next) => {
  const {
    MessageSid,
    MessageStatus,
  } = req.body;
  
  // Update that message with the new status
  TextMessage.get(MessageSid).run()
    .then((textMessage) => {
      textMessage.status = MessageStatus;
      textMessage.save()
        .then(tm => console.log(`Updated ${tm.messageSid} message to ${tm.status}!`))
        .catch(next);
    })
    .catch(next);
  
  // For twilio... needs a response
  res.send();
});

module.exports = twilioRouter;
