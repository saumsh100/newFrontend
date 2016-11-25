
const thinky = require('../config/thinky');
const type = thinky.type;

const Availability = thinky.createModel('Availability', {
  // TODO: figure out why adding .uuid() breaks...
  id: type.string(),
  title: type.string(),
  start: type.date().required(),
  end: type.date().required(),
}, {
  pk: 'id',
});

module.exports = Availability;
