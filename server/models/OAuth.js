import thinky from '../config/thinky';
import createModel from './createModel';

const type = thinky.type;

module.exports = createModel('OAuth', {
  provider: type.string().enum('FACEBOOK').required(),
  providerUserId: type.string().required(),
  patientId: type.string().uuid(4),
});
