const SegmentModel = require('../_models').Segment;

module.exports = {
  async up(queryInterface, Sequelize) { // eslint-disable-line
    let res = null;
    try {
      res = await SegmentModel.create({
        name: 'Test segment module',
        description: 'This is just a dummy data',
        accountId: '1aeab035-b72c-4f7a-ad73-09465cbf5654',
        module: 'patients',
        where: {
          age: {
            $gt: [10, 15],
          },
        },
      });
    } catch (error) {
      throw error;
    }

    return res;
  },

  down(queryInterface, Sequelize) { // eslint-disable-line
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
