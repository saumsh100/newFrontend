
import { type } from '../config/thinky';
import createModel from './createModel';

const AuthSession = createModel('AuthSession', {
  modelId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4),
  enterpriseId: type.string().uuid(4),

  role: type.string(),
  permissions: type.object().allowExtra(true),
});

export default AuthSession;
