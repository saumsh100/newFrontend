
const chatsRouter = require('express').Router();
const { r } = require('../../../config/thinky');
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const Chat = require('../../../models/Chat');
const TextMessage = require('../../../models/TextMessage');

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
    limit = 10,
    skip = 0,
  } = req.query;

  // Some default code to ensure we don't pull the entire conversation for each chat
  if (joinObject.textMessages) {
    joinObject.textMessages = {
      _apply: (sequence) => {
        // TODO: confirm that the order is correct
        return sequence
          .orderBy('createdAt')
          .limit(TEXT_MESSAGE_LIMIT);
      },
    };
  }

  // TODO: add orderBy for lastMessageDate
  return Chat
    .filter({ accountId })
    .skip(parseInt(skip))
    .limit(limit)
    .getJoin(joinObject)
    .run()
    .then(chats => {
      console.log(chats)
      res.send(normalize('chats', chats));
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
chatsRouter.post('/:_chatId/textMessages/read', checkPermissions('textMessages:update'), (req, res, next) => {
  return TextMessage.filter({ chatId: req.params._chatId, read: false })
    .update({ read: true })
    .run()
    .then(textMessages => res.send(normalize('textMessages', textMessages)))
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
