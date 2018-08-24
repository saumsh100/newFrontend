
import { Chat, TextMessage, User } from 'CareCruModels';
import { sequelizeLoader } from '../../util/loaders';
import {
  markMessagesAsRead,
  markMessagesAsUnread,
  resendMessage,
  updateChat,
} from '../../../services/chat';
import StatusError from '../../../util/StatusError';
import { getPatientFromCellPhoneNumber } from '../../../lib/contactInfo/getPatientFromCellPhoneNumber';

const chatsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const { sendMessage } = require('../../../services/chat');

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
          attributes: { exclude: 'password' },
          required: false,
        },
      ];
      order.push([{
        model: TextMessage,
        as: 'textMessages',
      }, 'createdAt', 'ASC']);
      include.required = true;
    }
    return include;
  });

  return Chat.findAll({
    where: {
      accountId,
      patientId: { $ne: null },
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
    const poc = await getPatientFromCellPhoneNumber({
      cellPhoneNumber,
      accountId,
    });
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

    const newChat = await Chat.create(chatMerge);
    const responseChat = await Chat.findOne({
      where: { id: newChat.id },
      include: [
        {
          model: TextMessage,
          as: 'textMessages',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: 'password' },
              required: false,
            },
          ],
          required: false,
        },
      ],
    });

    const sendChat = normalize('chat', responseChat.get({ plain: true }));
    return res.send(sendChat);
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
      message,
      patient: { id: patientId, accountId, mobilePhoneNumber: cellPhoneNumber },
      userId,
    } = req.body;

    if (!cellPhoneNumber) {
      throw new StatusError(400, 'Missing mobile phone number.');
    }

    const poc = await getPatientFromCellPhoneNumber({
      cellPhoneNumber,
      accountId,
    });

    if (!poc) {
      throw new StatusError(400, `There is not point of contact for ${cellPhoneNumber}.`);
    }

    if (poc.id !== patientId) {
      throw new StatusError(400, `This patient is not the point of contact for ${cellPhoneNumber}.`);
    }

    const chatData = await sendMessage(cellPhoneNumber, message, userId);
    return res.send(chatData);
  } catch (e) {
    return next(e);
  }
});

/**
 * Tries to resend a message that failed to send initialy.
 */
chatsRouter.put('/textMessage/:messageId/resend', checkPermissions('textMessages:create'), async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { patientId } = req.body;

    const chatData = await resendMessage(messageId, patientId);
    return res.send(chatData);
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
    where: { read: false },
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
          attributes: { exclude: 'password' },
          required: false,
        },
      ];
      order.push([{
        model: TextMessage,
        as: 'textMessages',
      }, 'createdAt', 'ASC']);
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
            attributes: { exclude: 'password' },
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
chatsRouter.get('/:chatId/textMessages', checkPermissions('textMessages:read'), (req, res, next) => {
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
            attributes: { exclude: 'password' },
            required: false,
          },
        ],
        required: false,
      },
    ],
  })
    .then(chat => res.send(normalize('chat', chat.get({ plain: true }))))
    .catch(next);
});

/**
 * Set all of a chat's textMessages recived after the given date to unread.
 */
chatsRouter.put('/:_chatId/textMessages/unread', checkPermissions('textMessages:update'), async (req, res, next) => {
  try {
    const {
      body: { textMessageCreatedAt, accountTwilioNumber },
      params: { _chatId: chatId },
    } = req;

    const data = await markMessagesAsUnread(chatId, textMessageCreatedAt, accountTwilioNumber);

    return res.send(data);
  } catch (err) {
    return next(err);
  }
});

/**
 * Set all of a chat's unread textMessages to read
 */
chatsRouter.put('/:_chatId/textMessages/read', checkPermissions('textMessages:update'), async (req, res, next) => {
  try {
    const { params: { _chatId: chatId } } = req;
    const data = await markMessagesAsRead(chatId);
    return res.send(data);
  } catch (e) {
    return next(e);
  }
});

/**
 * Update a chat
 */
chatsRouter.put('/:_chatId', checkPermissions('chats:update'), async (req, res, next) => {
  try {
    const { body, params: { _chatId: chatId } } = req;
    const data = await updateChat(chatId, body);
    return res.send(data);
  } catch (e) {
    return next(e);
  }
});

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
