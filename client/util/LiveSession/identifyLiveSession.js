
import ls from '@livesession/sdk';

// https://developers.livesession.io/javascript-api/methods/#identify
const identifyLiveSession = ({ user, patientUser, account, enterprise }) => {
  const isUser = user !== undefined;
  const name = isUser
    ? `${user.firstName} ${user.lastName}`
    : `${patientUser.firstName} ${patientUser.lastName}`;
  const email = isUser ? user.username : patientUser.email;
  const userId = isUser ? user.id : null;
  const patientUserId = !isUser ? patientUser.id : null;

  ls.identify({
    name,
    email,
    params: {
      userId,
      patientUserId,
      enterpriseId: enterprise && enterprise.id,
      enterpriseName: enterprise && enterprise.name,
      accountId: account.id,
      accountName: account.name,
      accountWebsite: account.website,
      accountTimezone: account.timezone,
      accountStreet: account.address.street,
      accountCity: account.address.city,
      accountState: account.address.state,
      accountCountry: account.address.country,
      canSendReminders: account.canSendReminders,
      canSendRecalls: account.canSendRecalls,
      canSendReviews: account.canSendReviews,
    },
  });
};

export default identifyLiveSession;
