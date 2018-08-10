
import uuid from 'uuid';
import { Chat, Account, TextMessage, User, Patient } from 'CareCruModels';
import { sequelizeLoader } from '../../util/loaders';
import StatusError from '../../../util/StatusError';
import { getPatientFromCellPhoneNumber } from '../../../lib/contactInfo/getPatientFromCellPhoneNumber';

const chatsRouter = require('express').Router();
const Sequelize = require('sequelize');
const moment = require('moment');
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const { namespaces } = require('../../../config/globals');
const twilio = require('../../../config/globals').twilio;
const twilioClient = require('../../../config/twilio');

const Op = Sequelize.Op;

chatsRouter.param('chatId', sequelizeLoader('chat', 'Chat'));

const TEXT_MESSAGE_LIMIT = 50;

/**
 * Get chats under a clinic
 */
chatsRouter.get('/', checkPermissions('chats:read'), (req, res, next) => {
  const { accountId, includeArray } = req;

  const { limit, skip } = req.query;

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
    where: {
      accountId,
      patientId: {
        $ne: null,
      },
    },
    order,
    limit: limitted,
    offset: skipped,
    include: newIncludeArray,
  })
    .then((chats) => {
      const allChats = chats.map(chat => chat.get({ plain: true }));
      return res.send(normalize('chats', allChats));
    })
    .catch(next);
});

/**
 * creates a new chat
 */

chatsRouter.post('/', checkPermissions('chats:create'), async (req, res, next) => {
  try {
    const accountId = req.body.patient.accountId;
    const patientId = req.body.patient.id;
    const cellPhoneNumber = req.body.patient.mobilePhoneNumber;
    const poc = await getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId });
    if (!poc) {
      throw new StatusError(400, `There is not point of contact for ${cellPhoneNumber}.`);
    }

    if (poc.id !== patientId) {
      throw new StatusError(400, `This patient is not the point of contact for ${cellPhoneNumber}.`);
    }

    const chatMerge = {
      lastTextMessageDate: new Date(),
      accountId,
      patientId,
      patientPhoneNumber: cellPhoneNumber,
    };

    return Chat.create(chatMerge)
      .then((chat) => {
        const joinObject = {patient: true};
        joinObject.textMessages = {
          _apply: sequence => sequence.orderBy('createdAt'),
        };

        return Chat.findOne({
          where: { id: chat.id },
          include: [
            {
              model: TextMessage,
              as: 'textMessages',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: {
                    exclude: 'password',
                  },
                  required: false,
                },
              ],
              required: false,
            },
          ],
        }).then((chats) => {
          const sendChat = normalize('chat', chats.get({plain: true}));
          return res.send(sendChat);
        });
      })
      .catch(next);
  } catch (err) {
    next(err);
  }
});

/**
 * creates a new text message and sends it using twilio
 */
chatsRouter.post('/textMessages', checkPermissions('textMessages:create'), async (req, res, next) => {
  try {
    const {
      chatId, message, patient, userId,
    } = req.body;

    if (!patient.mobilePhoneNumber) {
      throw new StatusError(400, 'Missing mobile phone number.');
    }

    const accountId = patient.accountId;
    const patientId = patient.id;
    const cellPhoneNumber = patient.mobilePhoneNumber;
    const poc = await getPatientFromCellPhoneNumber({ cellPhoneNumber, accountId });
    if (!poc) {
      throw new StatusError(400, `There is not point of contact for ${cellPhoneNumber}.`);
    }

    if (poc.id !== patientId) {
      throw new StatusError(400, `This patient is not the point of contact for ${cellPhoneNumber}.`);
    }

    const include = [
      {
        model: Patient,
        as: 'patient',
      },
      {
        model: TextMessage,
        as: 'textMessages',
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: 'password',
            },

            required: false,
          },
        ],

        required: true,
      },
    ];

    const io = req.app.get('socketio');

    const chatMerge = {
      lastTextMessageDate: new Date(),
      accountId: patient.accountId,
      patientId: patient.id,
      patientPhoneNumber: patient.mobilePhoneNumber,
    };

    return Account.findOne({where: {id: chatMerge.accountId}, raw: true})
      .then((account) => {
        const twilioMessageData = {
          body: message,
          chatId,
          userId,
          to: patient.mobilePhoneNumber,
          from: account.twilioPhoneNumber,
          read: true,
        };

        return twilioClient.sendMessage(twilioMessageData).then((sms) => {
          // Add twilio sid as our uniqueId
          twilioMessageData.id = sms.sid;
        })
          .catch(() => {
            // If sending fails, use temporary id and set status to failed.
            twilioMessageData.id = uuid();
            twilioMessageData.smsStatus = 'failed';
          })
          .finally(() => {
            // Create message anyway
            if (!chatId) {
              Chat.create(chatMerge).then((chat) => {
                twilioMessageData.chatId = chat.id;
                TextMessage.create(twilioMessageData).then((textMessage) => {
                  Chat.findOne({
                    where: {id: chat.id},
                    include,
                  }).then((chat) => {
                    const send = normalize('chat', chat.get({plain: true}));
                    io
                      .of(namespaces.dash)
                      .in(account.id)
                      .emit('newMessage', send);

                    res.send(send);
                  });
                });
              });
            } else {
              TextMessage.create(twilioMessageData)
                .then((tm) => {
                  const lastTextMessageId = tm.id;
                  const lastTextMessageDate = tm.createdAt;
                  Chat.update(
                    {lastTextMessageId, lastTextMessageDate},
                    {where: {id: chatId}},
                  ).then(() => {
                    Chat.findOne({
                      where: {id: chatId},
                      include,
                    }).then((chat) => {
                      const send = normalize('chat', chat.get({plain: true}));
                      io
                        .of(namespaces.dash)
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
  } catch (err) {
    next(err);
  }
});

/**
 * Tries to resend a message that failed to send initialy.
 */
chatsRouter.put('/textMessage/:messageId/resend', checkPermissions('textMessages:create'), async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { patientId } = req.body;

    const patient = await Patient.findById(patientId, { raw: true });
    const account = await Account.findById(patient.accountId, { raw: true });
    const textMessage = await TextMessage.findById(messageId);
    const chatId = textMessage.get('chatId');

    const twilioMessageData = {
      body: textMessage.get('body'),
      from: account.twilioPhoneNumber,
      to: patient.mobilePhoneNumber,
    };
    const sms = await twilioClient.sendMessage(twilioMessageData);

    // Create a new message composed from data of previous
    // but with the newly composed data.
    await TextMessage.create({
      id: sms.sid,
      chatId,
      userId: textMessage.get('userId'),
      from: twilioMessageData.from,
      to: twilioMessageData.to,
      body: twilioMessageData.body,
      read: true,
    });

    // Destroy an old message, that failed to send.
    await textMessage.destroy();

    const chat = await Chat.findById(chatId, {
      nest: true,
      include: [
        {
          model: Patient,
          as: 'patient',
        },
        {
          model: TextMessage,
          as: 'textMessages',
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude: 'password',
              },

              required: false,
            },
          ],
          required: true,
        },
      ],
    });

    const sendChat = normalize('chat', chat.get({ plain: true }));
    return res.send(sendChat);
  } catch (exception) {
    return next(exception);
  }
});

/**
 * Get the list of unread chats
 * */
chatsRouter.get('/unread', checkPermissions('chats:read'), (req, res, next) => {
  const { accountId, includeArray } = req;

  const { limit, skip } = req.query;

  const skipped = skip || 0;
  const limitted = limit || 25;

  const order = [['lastTextMessageDate', 'DESC']];

  const textMessageInclude = {
    model: TextMessage,
    as: 'textMessages',
    where: {
      read: false,
    },
    required: true,
  };

  return Chat.findAll({
    where: { accountId },
    order,
    offset: skipped,
    limit: limitted,
    include: [...includeArray, textMessageInclude],
  })
    .then((chats) => {
      const allChats = chats.map(chat => chat.get({ plain: true }));
      return res.send(normalize('chats', allChats));
    })
    .catch(next);
});

/**
 * Get the list of flagged chats
 * */
chatsRouter.get('/flagged', checkPermissions('chats:read'), (req, res, next) => {
  const { accountId, includeArray } = req;

  const { limit, skip } = req.query;

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
    where: {
      accountId,
      isFlagged: true,
    },
    order,
    limit: limitted,
    offset: skipped,
    include: newIncludeArray,
  })
    .then((chats) => {
      const allChats = chats.map(chat => chat.get({ plain: true }));
      return res.send(normalize('chats', allChats));
    })
    .catch(next);
});

/**
 * Get a chat
 */
chatsRouter.get('/:chatId', checkPermissions('chats:read'), (req, res, next) => Promise.resolve(req.chat)
  .then(chat => res.send(normalize('chat', chat.get({ plain: true }))))
  .catch(next));

chatsRouter.get('/patient/:patientId', checkPermissions('chats:read'), (req, res, next) => {
  const { accountId } = req;

  const { limit, skip } = req.query;

  const skipped = skip || 0;
  const limitted = limit || 25;
  const joinObject = {};

  // Some default code to ensure we don't pull the entire conversation for each chat

  return Chat.findOne({
    where: { patientId: req.params.patientId },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        order: [['createdAt', 'ASC']],
        limit: limitted,
        offset: skipped,
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: 'password',
            },
            required: false,
          },
        ],
      },
    ],
  })
    .then((chat) => {
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
chatsRouter.get(
  '/:chatId/textMessages',
  checkPermissions('textMessages:read'),
  (req, res, next) => {
    const { limit = TEXT_MESSAGE_LIMIT, skip = 0 } = req.query;

    // We re-query cause we need getJoin, didn't feel like duplicated some loaders code
    return Chat.findOne({
      where: { id: req.chat.id },
      include: [
        {
          model: TextMessage,
          as: 'textMessages',
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude: 'password',
              },
              required: false,
            },
          ],
          required: false,
        },
      ],
    })
      .then(chat => res.send(normalize('chat', chat.get({ plain: true }))))
      .catch(next);
  },
);

/**
 * Set all of a chat's textMessages recived after the given date to unread.
 */
chatsRouter.put(
  '/:_chatId/textMessages/unread',
  checkPermissions('textMessages:update'),
  async (req, res, next) => {
    try {
      const { textMessageCreatedAt, accountTwilioNumber } = req.body;
      const io = req.app.get('socketio');
      const chatId = req.params._chatId;

      await TextMessage.update(
        { read: false },
        {
          where: {
            chatId,
            to: accountTwilioNumber,
            createdAt: {
              [Op.gte]: moment(textMessageCreatedAt).toDate(),
            },
          },
        },
      );

      const chat = await Chat.findOne({
        where: {
          id: chatId,
        },
      });

      const messagesList = await TextMessage.findAll({
        raw: true,
        nest: true,
        where: { chatId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: 'password',
            },
            required: false,
          },
        ],
      });

      const normalizedMessages = normalize('textMessages', messagesList);

      io
        .of(namespaces.dash)
        .in(chat.accountId)
        .emit('markUnread', normalizedMessages);

      return res.send(normalizedMessages);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * Set all of a chat's unread textMessages to read
 */
chatsRouter.put(
  '/:_chatId/textMessages/read',
  checkPermissions('textMessages:update'),
  async (req, res, next) => {
    try {
      const io = req.app.get('socketio');
      const chatId = req.params._chatId;

      const messages = await TextMessage.update(
        { read: true },
        {
          where: {
            chatId,
            read: false,
          },
        },
      ).then(() => TextMessage.findAll({
        raw: true,
        nest: true,
        where: { chatId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: 'password',
            },
            required: false,
          },
        ],
      }));

      const chat = await Chat.findOne({
        where: {
          id: chatId,
        },
      });

      const normalizedMessages = normalize('textMessages', messages);

      io &&
        io
          .of(namespaces.dash)
          .in(chat.accountId)
          .emit('markRead', normalizedMessages);

      res.send(normalizedMessages);
    } catch (e) {
      next(e);
    }
  },
);

/**
 * Update a chat
 */
chatsRouter.put('/:chatId', checkPermissions('chats:update'), (req, res, next) => req.chat
  .update(req.body)
  .then(chat => res.send(normalize('chat', chat.get({ plain: true }))))
  .catch(next));

/**
 * Delete a chat
 */
chatsRouter.delete('/:chatId', checkPermissions('chats:delete'), (req, res, next) =>
  // We actually delete chats as we don't care about history
  req.chat
    .destroy()
    .then(() => res.status(204).send())
    .catch(next));

module.exports = chatsRouter;
