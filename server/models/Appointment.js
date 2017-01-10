
const thinky = require('../config/thinky');
const type = thinky.type;

const Appointment = thinky.createModel('Appointment', {
  // TODO: figure out why adding .uuid() breaks...
  id: type.string().uuid(4),
  title: type.string(),
  start: type.date().required(),
  end: type.date().required(),
  createdAt: type.date(),
  reminderCode: type.string().default(() => (
     `C${Math.floor((Math.random() * 90) + 10)}`
  )),
  confirmed: type.boolean().default(false),
});


module.exports = Appointment;
