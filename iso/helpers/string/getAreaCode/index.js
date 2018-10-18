
/**
 *
 * Return the area code of a phone number
 * @param phoneNumber
 * @returns {*|string}
 */
const getAreaCode = phoneNumber =>
  phoneNumber
    .trim()
    .replace(/^\+[0-9]/, '')
    .substring(0, 3);

export default getAreaCode;
