/**
 * Validates phone number.
 * @param phoneNumber string phone number. Can be empty, null, undefined - anything.
 * @return phone number String or null if invalid.
 */
function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber || phoneNumber.length < 10) return null;

  const pn = phoneNumber.replace(/\D/g, '');

  if (pn.length === 10) {
    return '+1'.concat(pn);
  }
  if (pn.length === 11) {
    return '+'.concat(pn);
  }
  return null;
}

module.exports = {
  validatePhoneNumber,
};
