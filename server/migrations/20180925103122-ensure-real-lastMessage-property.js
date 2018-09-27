'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        // Fetch all chats
        const chats = await queryInterface.sequelize.query(
          'SELECT "id", "lastTextMessageId", "lastTextMessageDate" FROM "Chats";',
          { transaction },
        );
        // Map chat values
        const chatsList = chats[0].map(c => ({
          id: c.id,
          lastTextMessageId: c.lastTextMessageId,
          lastTextMessageDate: c.lastTextMessageDate,
        }));

        for (const chat of chatsList) {
          // Fetch last text message received for that chat
          const textMessage = await queryInterface.sequelize.query(
            `
            SELECT "id", "createdAt" from "TextMessages"
            WHERE "chatId" = '${chat.id}'
            ORDER BY "createdAt" DESC
            LIMIT 1;
            `,
            { transaction },
          );
          const lastTextMessage = textMessage[0][0];
          const currentLastMessageDate = Date.parse(chat.lastTextMessageDate);
          const messageCreatedAtDate = Date.parse(lastTextMessage.createdAt);
          // Check if chat has to be updated
          if (
            currentLastMessageDate.toString() !== messageCreatedAtDate.toString()
            || chat.lastTextMessageId !== lastTextMessage.id
          ) {
            // Update chat
            await queryInterface.sequelize.query(
              `
              UPDATE "Chats" SET
              "lastTextMessageId" = :lastMessageId,
              "lastTextMessageDate" = :lastMessageDate
              WHERE "id" = :id;
              `,
              {
                transaction,
                replacements: {
                  id: chat.id,
                  lastMessageId: lastTextMessage.id,
                  lastMessageDate: lastTextMessage.createdAt,
                },
              },
            );
          }
        }
      } catch (err) {
        console.log(err);
        transaction.rollback();
      }
    });
  },
};
