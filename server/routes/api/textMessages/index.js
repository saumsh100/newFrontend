
const { normalize, Schema, arrayOf } = require('normalizr');
const textMessagesRouter = require('express').Router();
const _ = require('lodash');
const TextMessage = require('../../../models/TextMessage');
const Practitioner = require('../../../models/Practitioner');
const twilioClient = require('../../../config/twilio');
const uuid = require('uuid').v4;
const Patient = require('../../../models/Patient');
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

textMessagesRouter.get('/dialogs', (req, res, next) => {
  Practitioner.filter({ accountId: req.user.activeAccountId }).getJoin().run()
  .then((practitioners) => {
    const textMessages = _.flatten(practitioners.map(p => p.textMessages)).sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const groupedByPatientId = _.groupBy(textMessages, a => a.patientId);
    const objKeys = Object.keys(groupedByPatientId);
    objKeys.forEach(key => {
      let unreadMessages = 0;
      groupedByPatientId[key].forEach(item => {
        if (item.read === false) unreadMessages += 1;
      });
      const lastMessageText = groupedByPatientId[key][groupedByPatientId[key].length - 1].body;
      const lastMessageTime = groupedByPatientId[key][groupedByPatientId[key].length - 1].createdAt;
      groupedByPatientId[key].push({ unreadMessages });
      groupedByPatientId[key].push({
        lastMessageText,
      });
      groupedByPatientId[key].push({
        lastMessageTime,
      });
    });
    res.send(groupedByPatientId);
  });
  /* .then((doctorsIds) => {
    res.send(doctorsIds);
  }) */
});

textMessagesRouter.post('/', (req, res, next) => {
  const { body, patientId } = req.body;
  Practitioner.execute().then((practitioners) => {
    TextMessage.save({
      id: uuid(),
      practitionerId: practitioners[0].id,
      patientId,
      body,
    })
    .then(textMessages => res.send(normalize(textMessages, textMessageSchema)))
    .catch(next);
  });
});

module.exports = textMessagesRouter;
