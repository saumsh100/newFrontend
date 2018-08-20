
import uuid from 'uuid';
import twilioClient from '../../config/twilio';
import logger from '../../config/logger';
import { sanitizeTwilioSmsData } from '../../routes/_twilio/util';
import { receiveMessage } from '../chat';

/**
 * Used for sending a message to the phone number.
 * It always returns id and smsStatus fields.
 * If it enters the catch block, we set the temporary id and smsStatus
 * to failed, this will allow us to resend message on demand.
 * @param from {string} A phone number we are sending a message from
 * @param to {string} A phone number we are sending a message to
 * @param body {string} A content of the message
 * @returns {Promise<*>}
 */
export async function sendSMS({ from, to, body }) {
  try {
    logger.debug(`Sending SMS from ${from} to ${to}.`);
    const message = await twilioClient.sendMessage({ from, to, body });
    return sanitizeTwilioSmsData(message);
  } catch (exception) {
    return {
      id: uuid(),
      smsStatus: 'failed',
    };
  }
}

/**
 * Receive a SMS, sanitize data and forward it to chat service.
 * @param account {Account} The account received message is for
 * @param sms {Object} Received SMS that has to be processed.
 * @returns {Promise}
 */
export function receiveSMS(account, sms) {
  const sanitizedData = sanitizeTwilioSmsData(sms);
  return receiveMessage(account, sanitizedData);
}
