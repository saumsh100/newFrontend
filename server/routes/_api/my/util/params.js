
import pick from 'lodash/pick';

const ALLOWED_ATTRS = [
  'name',
  'address',
  'website',
  'contactEmail',
  'phoneNumber',
  'fullLogoUrl',
  'facebookUrl',
  'googlePlaceId',
  'bookingWidgetPrimaryColor',
  'timezone',
];

export function generateAccountParams(account) {
  if (account.fullLogoUrl) {
    account.fullLogoUrl = account.fullLogoUrl.replace('[size]', 'original');
  }

  const accountJSON = account.get({ plain: true });
  return pick(accountJSON, ALLOWED_ATTRS);
}

export function encodeParams(params) {
  const paramsStr = JSON.stringify(params);
  return new Buffer(paramsStr).toString('base64');
}
