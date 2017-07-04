
const chatsRouter = require('express').Router();
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const Chat = require('../../../models/Chat');
const Account = require('../../../models/Account');
const TextMessage = require('../../../models/TextMessage');
const { namespaces } = require('../../../config/globals');
const twilio = require('../../../config/globals').twilio;
const twilioClient = require('../../../config/twilio');

chatsRouter.param('chatId', loaders('chat', 'Chat'));

const TEXT_MESSAGE_LIMIT = 50;

/**
 * Get chats under a clinic
 */
chatsRouter.get('/', checkPermissions('chats:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  const {
    limit,
    skip,
  } = req.query;

  const skipped = skip || 0;
  const limitted = limit || 25;

  // Some default code to ensure we don't pull the entire conversation for each chat
  if (joinObject.textMessages) {
    joinObject.textMessages = {
      _apply: (sequence) => {
        return sequence
          .orderBy('createdAt')
          .limit(TEXT_MESSAGE_LIMIT);
      },
      user: true,
    };
  }

  return Chat
    .orderBy(r.desc('lastTextMessageDate'))
    .filter({ accountId })
    .skip(parseInt(skipped))
    .limit(parseInt(limitted))
    .getJoin(joinObject)
    .run()
    .then(chats => {
      res.send(normalize('chats', chats));
    })
    .catch(next);
});

/**
 * creates a new chat
 */

chatsRouter.post('/', checkPermissions('chats:create'), (req, res, next) => {
  const chatMerge = {
    lastTextMessageDate: new Date(),
    accountId: req.body.patient.accountId,
    patientId: req.body.patient.id,
    patientPhoneNumber: req.body.patient.mobilePhoneNumber,
  };

  return Chat.save(chatMerge).then((chat) => {
    const joinObject = { patient: true };
    joinObject.textMessages = {
      _apply: (sequence) => {
        return sequence
          .orderBy('createdAt');
      },
    };

    Chat.get(chat.id).getJoin(joinObject).run()
      .then((chats) => {
        const sendChat = normalize('chat', chats);
        res.send(sendChat);
      });
  });
});

/**
  * creates a new text message and sends it using twilio
 */
chatsRouter.post('/textMessages', checkPermissions('textMessages:create'), (req, res, next) => {
  const {
    chatId,
    message,
    patient,
    userId,
  } = req.body;

  const mergeData = {
    lastTextMessageDate: new Date(),
  };

  const joinObject = {
    patient: true,
    textMessages: {
      _apply: (sequence) => {
        return sequence
          .orderBy('createdAt')
          .limit(TEXT_MESSAGE_LIMIT);
      },
      user: true,
    },
  };

  const io = req.app.get('socketio');

  const chatMerge = {
    lastTextMessageDate: new Date(),
    accountId: patient.accountId,
    patientId: patient.id,
  };

  return Account.get(chatMerge.accountId).run()
    .then((account) => {
      const textMessages = {
        body: message,
        chatId,
        userId,
        to: patient.mobilePhoneNumber,
        from: account.twilioPhoneNumber,
      };

      return twilioClient.sendMessage(textMessages)
        .then((sms) => {
          // Add twilio sid as our uniqueId
          textMessages.id = sms.sid;
          if (!chatId) {
            Chat.save(chatMerge).then((chat) => {
              TextMessage.save(textMessages)
                .then((chats) => {
                  const send = normalize('chat', chats);
                  io.of(namespaces.dash)
                    .in(account.id)
                    .emit('newMessage', send);

                  res.send(send);
                });
            });
          } else {
            TextMessage.save(textMessages)
              .then(() => {
                Chat.get(chatId).getJoin(joinObject).run()
                  .then((chat) => {
                    chat.merge(mergeData).save().then((chats) => {
                      const send = normalize('chat', chats);
                      io.of(namespaces.dash)
                        .in(account.id)
                        .emit('newMessage', send);

                      res.send(send);
                    });
                  });
              })
              .catch(next);
          }
        });
    })
    .catch(next);
});

/**
 * Get a chat
 */
chatsRouter.get('/:chatId', checkPermissions('chats:read'), (req, res, next) => {
  return Promise.resolve(req.chat)
    .then(chat => res.send(normalize('chat', chat)))
    .catch(next);
});

chatsRouter.get('/patient/:patientId', checkPermissions('chats:read'), (req, res, next) => {
  const {
    accountId,
  } = req;

  const {
    limit,
    skip,
  } = req.query;

  const skipped = skip || 0;
  const limitted = limit || 25;
  const joinObject = {};

  // Some default code to ensure we don't pull the entire conversation for each chat
  joinObject.textMessages = {
    _apply: (sequence) => {
      return sequence
        .orderBy('createdAt')
        .limit(limitted);
    },
  };

  return Chat
    .orderBy(r.desc('lastTextMessageDate'))
    .filter({
      accountId,
      patientId: req.params.patientId })
    .skip(parseInt(skipped))
    .limit(parseInt(limitted))
    .getJoin(joinObject)
    .run()
    .then(chats => {
      res.send(normalize('chats', chats));
    })
    .catch(next);

});



/**
 * Get a chat's textMessages
 */
chatsRouter.get('/:chatId/textMessages', checkPermissions('textMessages:read'), (req, res, next) => {
  const {
    limit = TEXT_MESSAGE_LIMIT,
    skip = 0,
  } = req.query;

  const joinObject = {
    textMessages: {
      _apply: (sequence) => {
        // TODO: confirm that the order is correct
        return sequence
          .orderBy(r.desc('createdAt'))
          .skip(parseInt(skip))
          .limit(Math.min(parseInt(limit), 100));
      },
      user: true,
    },
  };

  // We re-query cause we need getJoin, didn't feel like duplicated some loaders code
  return Chat.get(req.chat.id)
    .getJoin(joinObject)
    .run()
    .then(chat => res.send(normalize('chat', chat)))
    .catch(next);
});

/**
 * Set all of a chat's unread textMessages to read
 */
chatsRouter.put('/:_chatId/textMessages/read', checkPermissions('textMessages:update'), (req, res, next) => {
  return TextMessage.filter({ chatId: req.params._chatId, read: false })
    .update({ read: true })
    .run()
    .then(() => {
      TextMessage.filter({ chatId: req.params._chatId })
          .getJoin({ user: true })
          .run()
          .then(textMessages => res.send(normalize('textMessages', textMessages)));
    })
    .catch(next);
});

/**
 * Update a chat
 */
chatsRouter.put('/:chatId', checkPermissions('chats:update'), (req, res, next) => {
  return req.chat.merge(req.body).save()
    .then(chat => res.send(normalize('chat', chat)))
    .catch(next);
});

/**
 * Delete a chat
 */
chatsRouter.delete('/:chatId', checkPermissions('chats:delete'), (req, res, next) => {
  // We actually delete chats as we don't care about history
  return req.chat.delete()
    .then(() => res.send(204))
    .catch(next);
});

module.exports = chatsRouter;
