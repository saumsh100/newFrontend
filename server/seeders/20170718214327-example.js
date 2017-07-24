const SegmentModel = require('../_models').Segment;

module.exports = {
  up: async function(queryInterface, Sequelize) { // eslint-disable-line
    let res = null;
    try {
      res = await SegmentModel.create({
        name: 'Test name',
        someInteger: 1,
        someJson: {
          test1: 1,
          test2: 2,
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
