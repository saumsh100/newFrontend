'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        queryInterface.addColumn(
          'Chats',
          'hasUnread',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction },
        );

        // MARK: - Update Chats
        const textMessages = await queryInterface.sequelize.query('SELECT "chatId" FROM "TextMessages" WHERE "read" = false GROUP BY "chatId"');
        if (textMessages[0].length > 0) {
          Promise.all(textMessages[0].map(({ chatId }) => queryInterface.sequelize.query(
            `UPDATE "Chats" 
              SET "hasUnread" = true
              WHERE id = '${chatId}'`,
            { transaction },
          ))).catch((err) => {
            console.error(err);
            transaction.rollback();
          });
        }
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    });
  },
  down: queryInterface =>
    queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Chats',
          'hasUnread',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    }),
};
