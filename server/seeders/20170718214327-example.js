const SegmentModel = require('../_models').Segment;
module.exports = {
  async up(queryInterface, Sequelize) {
    let res = null;
    try {
      res = await SegmentModel.create({
        name: 'Test name',
      });
    } catch (error) {
      throw error;
    }

    return res;
  },

  down(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
