
const thinky = require('../config/thinky');
const type = thinky.type;

function createModel(tableName, schema) {
  schema.id = type.string().uuid(4);
  schema.createdAt = type.date().default(thinky.r.now());
  const Model = thinky.createModel(tableName, schema, {
    // Helpful to create from req.body for API endpoints
    enforce_extra: 'remove',
  });

  return Model;
}

const Chat = createModel('Chat', {
  lastTextMessageDate: type.date(),
});

const TextMessage = createModel('TextMessage', {
  chatId: type.string().uuid(4).required(),
  body: type.string().required(),
});

Chat.hasMany(TextMessage, 'textMessages', 'id', 'chatId');

Chat.save({

}).then((chat) => {
  console.log('saved chat', chat);
  const chatId = chat.id;
  TextMessage.save([
    {
      chatId,
      body: 'Hi',
    },
    {
      chatId,
      body: 'Hello',
    },
  ]).then((textMessages) => {
    console.log('saved textMessages', textMessages);
    return queryJoinData();
  }).catch((err) => {
    process.exit(1);
    console.err(err);
  });
}).catch((err) => {
  process.exit(1);
  console.err(err);
});

function queryJoinData() {
  return Chat.getJoin({ textMessages: true }).run()
    .then(chats => console.log(chats, chats[0].textMessages))
    .catch((err) => {
      process.exit(1);
      console.err(err);
    });
}
