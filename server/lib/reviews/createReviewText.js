
import { getMessageFromTemplates } from '../../services/communicationTemplate';

/**
 * createReviewText will generate the SMS message needed to for the
 * review request SMS
 *
 * @param patient
 * @param account
 * @param link
 * @return {Promise<string>}
 */
export const createReviewText = async ({ patient, account, link }) => getMessageFromTemplates(account.id, 'review-request', {
  account,
  patient,
  link,
});
