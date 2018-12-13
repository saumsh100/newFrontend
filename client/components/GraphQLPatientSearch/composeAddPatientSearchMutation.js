
import jwt from 'jwt-decode';

export default function ({ ccId: patientId }, context) {
  const token = localStorage.getItem('token');
  const { activeAccountId, userId } = jwt(token);

  return {
    patientId,
    userId,
    context,
    accountId: activeAccountId,
  };
}
