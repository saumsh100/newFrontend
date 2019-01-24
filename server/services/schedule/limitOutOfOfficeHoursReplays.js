
import moment from 'moment';
import { Account, Chat, TextMessage } from 'CareCruModels';

const MESSAGES_LIMIT = 0;

/**
 * Perform a complete check if limit is reached for the given account id and number.
 * @param accountId
 * @param fromNumber
 * @return {Promise<boolean>}
 */
export async function isLimitReachedForPhoneNumber(accountId, fromNumber) {
  const limitForAccount = await getAccountLimit(accountId);

  if (!limitForAccount) {
    return false;
  }

  return !await canReceiveMessage(accountId, fromNumber, limitForAccount);
}

/**
 * Determinate if message can be received (only if there ware no messages sent
 * to the same user within the buffered time)
 * @param accountId
 * @param to
 * @param timeBuffer
 * @return {Promise<boolean>}
 */
export async function canReceiveMessage(accountId, to, timeBuffer) {
  const [bufferAmount, bufferUnit] = timeBuffer.split(' ');
  const createdAt = { $gt: moment().subtract(bufferAmount, bufferUnit).toISOString() };

  const messagesWithinBuffer = await Chat.findAll({
    attributes: ['id'],
    where: {
      accountId,
      lastTextMessageDate: createdAt,
    },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        required: true,
        attributes: ['createdAt'],
        where: {
          to,
          isOutsideOfficeHoursRespond: true,
          createdAt,
        },
      },
    ],
  });

  return messagesWithinBuffer.length <= MESSAGES_LIMIT;
}

/**
 * Get the limit set on the account.
 * @param accountId
 * @return {Promise<boolean|string>}
 */
async function getAccountLimit(accountId) {
  const account = await Account.findByPk(accountId);
  return account && account.get('autoRespondOutsideOfficeHoursLimit');
}
