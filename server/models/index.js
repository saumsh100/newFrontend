
const Availability = require('./Availability');
const Patient = require('./Patient');
const TextMessage = require('./TextMessage');
const User = require('./User');
const Account = require('./Account');

// define relations
User.belongsTo(Account, 'activeAccount', 'activeAccountId', 'id')

module.exports = {
  Availability,
  Patient,
  TextMessage,
  User,
  Account,
};
