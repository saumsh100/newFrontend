
const { normalize, Schema, arrayOf } = require('normalizr');
const textMessagesRouter = require('express').Router();
const TextMessage = require('../../../models/TextMessage');
const twilioClient = require('../../../config/twilio');

const textMessageSchema = new Schema('textMessageSchema');

// TODO: this should have default queries and limits
textMessagesRouter.get('/', (req, res, next) => {
  const {
    patientId,
    limit,
    offset,
  } = req.query;
  
  // TODO: needs an auth layer to see if this requesting account has access to this patient
  
  TextMessage.getAll(patientId, { index: 'patientId' })
    .limit(Math.min(limit, 100))
    .orderBy('createdAt')
    .run()
    .then(textMessages => res.send(normalize(textMessages, arrayOf(textMessageSchema))))
    .catch(next);
});

textMessagesRouter.get('/twilio', (req, res, next) => {
  twilioClient.messages.list((err, data) => {
    res.send(data);
  });
});

module.exports = textMessagesRouter;
