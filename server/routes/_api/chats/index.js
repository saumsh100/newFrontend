
import { Chat, Account, TextMessage, User, Patient } from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';

const chatsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const { namespaces } = require('../../../config/globals');
const twilio = require('../../../config/globals').twilio;
const twilioClient = require('../../../config/twilio');

chatsRouter.param('chatId', sequelizeLoader('chat', 'Chat'));

const TEXT_MESSAGE_LIMIT = 50;

/**
 * Get chats under a clinic
 */
chatsRouter.get('/', checkPermissions('chats:read'), (req, res, next) => {
  const {
    accountId,
    includeArray,
  } = req;

  const {
    limit,
    skip,
  } = req.query;

  const skipped = skip || 0;
  const limitted = limit || 25;
  const order = [['lastTextMessageDate', 'DESC']];
  // Some default code to ensure we don't pull the entire conversation for each chat
  const newIncludeArray = includeArray.map((include) => {
    if (include.as === 'textMessages') {
      include.include = [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: 'password',
          },
          required: false,
        },
      ];
      order.push([{ model: TextMessage, as: 'textMessages' }, 'createdAt', 'ASC']);
      include.required = true;
    }
    return include;
  });

  return Chat.findAll({
    where: { accountId },
    order,
    limit: limitted,
    offset: skipped,
    include: newIncludeArray,
  }).then((chats) => {
    const allChats = chats.map(chat => chat.get({ plain: true }));
    return res.send(normalize('chats', allChats));
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

  return Chat.create(chatMerge).then((chat) => {
    const joinObject = { patient: true };
    joinObject.textMessages = {
      _apply: (sequence) => {
        return sequence
          .orderBy('createdAt');
      },
    };

    return Chat.findOne({
      where: { id: chat.id },
      include: [{
        model: TextMessage,
        as: 'textMessages',
        include: [{
          model: User,
          as: 'user',
          attributes: {
            exclude: 'password',
          },
          required: false,
        }],
        required: false,
      }],
    }).then((chats) => {
      const sendChat = normalize('chat', chats.get({ plain: true }));
      return res.send(sendChat);
    });
  })
  .catch(next);
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

  if (!patient.mobilePhoneNumber) {
    return res.sendStatus(400);
  }

  const mergeData = {
    lastTextMessageDate: new Date(),
  };


  const include = [
    {
      model: Patient,
      as: 'patient',
    },
    {
      model: TextMessage,
      as: 'textMessages',
      include: [{
        model: User,
        as: 'user',
        attributes: {
          exclude: 'password',
        },
        required: false,
      }],
      required: true,
    },
  ];

  const io = req.app.get('socketio');

  const chatMerge = {
    lastTextMessageDate: new Date(),
    accountId: patient.accountId,
    patientId: patient.id,
  };

  Chat.findOne({ where: { id: chatMerge.accountId }, raw: true })
  return Account.findOne({ where: { id: chatMerge.accountId }, raw: true })
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
            Chat.create(chatMerge).then((chat) => {
              TextMessage.create(textMessages)
                .then((chats) => {
                  chats = chats.get({ plain: true });
                  const send = normalize('chat', chats);
                  io.of(namespaces.dash)
                    .in(account.id)
                    .emit('newMessage', send);

                  res.send(send);
                });
            });
          } else {
            TextMessage.create(textMessages)
              .then(() => {
                Chat.update({ mergeData }, { where: { id: chatId } })
                  .then(() => {
                    Chat.findOne({
                      where: { id: chatId },
                      include,
                    }).then((chats) => {
                      const send = normalize('chat', chats.get({ plain: true }));
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
    .then(chat => res.send(normalize('chat', chat.get({ plain: true }))))
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

  return Chat.findOne({
    where: { patientId: req.params.patientId },
    include: [{
      model: TextMessage,
      as: 'textMessages',
      order: [['createdAt', 'ASC']],
      limit: limitted,
      offset: skipped,
      include: [{
        model: User,
        as: 'user',
        attributes: {
          exclude: 'password',
        },
        required: false,
      }],
    }],
  }).then((chat) => {
    if (!chat) {
      return res.send(200);
    }
    return res.send(normalize('chat', chat.get({ plain: true })));
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

  // We re-query cause we need getJoin, didn't feel like duplicated some loaders code
  return Chat.findOne({
    where: { id: req.chat.id },
    include: [{
      model: TextMessage,
      as: 'textMessages',
      include: [{
        model: User,
        as: 'user',
        attributes: {
          exclude: 'password',
        },
        required: false,
      }],
      required: false,
    }],
  }).then(chat => res.send(normalize('chat', chat.get({ plain: true }))))
  .catch(next);
});

/**
 * Set all of a chat's unread textMessages to read
 */
chatsRouter.put('/:_chatId/textMessages/read', checkPermissions('textMessages:update'), (req, res, next) => {

  return TextMessage.update({ read: true }, { where: { chatId: req.params._chatId, read: false } })
  .then((test) => {
    return TextMessage.findAll({
      raw: true,
      nest: true,
      where: { chatId: req.params._chatId },
      include: [{
        model: User,
        as: 'user',
        attributes: {
          exclude: 'password',
        },
        required: false,
      }],
    })
    .then(textMessages => {
      res.send(normalize('textMessages', textMessages));
    });
  }).catch(next);
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
  return req.chat.destroy()
    .then(() => res.status(204).send())
    .catch(next);
});

module.exports = chatsRouter;
