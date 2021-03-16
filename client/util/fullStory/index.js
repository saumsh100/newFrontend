/* eslint-disable camelcase */
/* eslint-disable consistent-return */

export function identifyPracticeUser({ account, enterprise, user }) {
  if (!window.FS || !window.FS.identify) {
    console.error('FullStory Error: window.FS.identify is not defined');
    return;
  }

  return window.FS.identify(user.id, {
    displayName: `${user.firstName} ${user.lastName}`,
    email: user.username,
    enterpriseId_str: enterprise.id,
    enterpriseName_str: enterprise.name,
    accountId_str: account.id,
    accountName_str: account.name,
    accountWebsite_str: account.website,
    accountTimezone_str: account.timezone,
    accountStreet_str: account.address.street,
    accountCity_str: account.address.city,
    accountState_str: account.address.state,
    accountCountry_str: account.address.country,
    canSendReminders_bool: account.canSendReminders,
    canSendRecalls_bool: account.canSendRecalls,
    canSendReviews_bool: account.canSendReviews,
  });
}

export function setOnlineBookingUserVars({ account }) {
  if (!window.FS || !window.FS.setUserVars) {
    console.error('FullStory Error: window.FS.setUserVars is not defined');
    return;
  }

  return window.FS.setUserVars({
    accountId_str: account.id,
    accountName_str: account.name,
    accountWebsite_str: account.website,
    accountTimezone_str: account.timezone,
    accountStreet_str: account.address.street,
    accountCity_str: account.address.city,
    accountState_str: account.address.state,
    accountCountry_str: account.address.country,
    canSendReminders_bool: account.canSendReminders,
    canSendRecalls_bool: account.canSendRecalls,
    canSendReviews_bool: account.canSendReviews,
  });
}
