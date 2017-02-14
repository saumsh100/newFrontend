
const chatsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const loaders = require('../../util/loaders');
const normalize = require('../normalize');
const chat = require('../../../models/Chat');

chatsRouter.param('chatId', loaders('chat', 'Chat'));

/**
 * Get chats under a clinic
 */
chatsRouter.get('/', checkPermissions('chats:read'), (req, res, next) => {
  const { accountId } = req;

  // There is no joinData for chat, no need to put...
  return chat.filter({ accountId }).run()
    .then(chats => res.send(normalize('chats', chats)))
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
