
const { normalize, Schema, arrayOf } = require('normalizr');
const textMessagesRouter = require('express').Router();
const _ = require('lodash');
const TextMessage = require('../../../models/TextMessage');
const Practitioner = require('../../../models/Practitioner');

const twilioClient = require('../../../config/twilio');
const uuid = require('uuid').v4;
const Patient = require('../../../models/Patient');
const Account = require('../../../models/Account');
const textMessageSchema = new Schema('textMessageSchema');
const dialogSchema = new Schema('dialogSchema');

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

textMessagesRouter.get('/dialogs', (req, res, next) => {
  Account.filter({ id: req.token.activeAccountId }).getJoin().run()
    .then((accounts) => {
      console.log("Accounts")
      console.log(accounts)
      const { textMessages } = accounts[0];
      const sortedMessages = textMessages.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const groupedByPatientId = _.groupBy(sortedMessages, a => a.patientId);
      const tempDialogs = {};
      const patientIds = Object.keys(groupedByPatientId);
      patientIds.forEach((key, index) => {
        const tempObject = {};
        tempObject.patientId = key;
        tempObject.messages = groupedByPatientId[key];
        let unreadCount = 0;
        groupedByPatientId[key].forEach(t => {
          if (t.read === false && t.senderId === key) unreadCount += 1;
        });
        tempObject.unreadCount = unreadCount;
        tempObject.lastMessageText = groupedByPatientId[key][groupedByPatientId[key].length - 1].body;
        tempObject.lastMessageTime = groupedByPatientId[key][groupedByPatientId[key].length - 1].createdAt;
        tempDialogs[key] = tempObject;
      });

      const resultStructure = {
        entities: { dialogs: tempDialogs },
        results: patientIds,
      }
      return res.send(resultStructure);
    });
});

textMessagesRouter.post('/', (req, res, next) => {
  const { body, patientId, createdAt } = req.body;
  Practitioner.execute().then((practitioners) => {
    TextMessage.save({
      id: uuid(),
      practitionerId: practitioners[0].id,
      patientId,
      body,
      accountId: req.token.activeAccountId,
      createdAt,
    })
    .then(textMessages => res.send(normalize(textMessages, textMessageSchema)))
    .catch(next);
  });
});

module.exports = textMessagesRouter;
