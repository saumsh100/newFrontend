
const thinky = require('../config/thinky');
const type = thinky.type;

const Availability = thinky.createModel('Availability', {
  // TODO: figure out why adding .uuid() breaks...
  id: type.string(),
  title: type.string(),
  start: type.date().required(),
  end: type.date().required(),
  createdAt: type.date().default(thinky.r.now()),
}, {
  pk: 'id',
});

module.exports = Availability;
