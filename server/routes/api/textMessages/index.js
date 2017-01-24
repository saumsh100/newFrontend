
const { normalize, Schema, arrayOf } = require('normalizr');
const uuid = require('uuid').v4;
const textMessagesRouter = require('express').Router();
const TextMessage = require('../../../models/TextMessage');
const Practitioner = require('../../../models/Practitioner');
const twilioClient = require('../../../config/twilio');

const textMessageSchema = new Schema('textMessages');

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

textMessagesRouter.get('/conversation', (req, res, next) => {
  const { patientId, practitionerId, startDate, accountId } = req.query;
  const startDateTimestamp = new Date(startDate).getTime();

  // startDate format must be like this ->  2017-01-03T10:30:00.000Z

  Practitioner.filter({ accountId }).execute().then((pr) => {
    if (pr.length === 0) {
      return next({ status: 403 });
    }
    TextMessage.filter({ patientId, practitionerId }).orderBy('createdAt').run().then((textMessages) => {
      const smsFilteredByDate = textMessages.filter(sms =>
        sms.createdAt.getTime() >= startDateTimestamp
      );
      res.send(normalize(smsFilteredByDate, arrayOf(textMessageSchema)));
    })
    .catch(next);
  })
  .catch(next);


});
textMessagesRouter.post('/', (req, res, next) => {
    const {
        body,
        patientId
    } = req.body;
    Practitioner.execute().then((practitioners) => {
        TextMessage.save({
                id: uuid(),
                createdAt: Date.now(),
                practitionerId: practitioners[0].id,
                patientId,
                body,
            })
            .then(textMessages => res.send(normalize(textMessages, textMessageSchema)))
            .catch(next);
    });
});

module.exports = textMessagesRouter;
