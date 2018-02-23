/**
 * createReviewText will generate the SMS message needed to for the
 * review request SMS
 *
 * @param patient
 * @param account
 * @param link
 * @return {string}
 */
export const createReviewText = ({ patient, account, link }) => {
  return `${patient.firstName}, we hope you had a lovely visit. ` +
    `Let us know how it went by clicking the link below. ` +
    `${link}`;
};
