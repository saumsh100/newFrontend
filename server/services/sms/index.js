
import twilioClient from '../../config/twilio';
import logger from '../../config/logger';

export function sendSMS({ from, to, body }) {
  logger.debug(`Sending SMS from ${from} to ${to}.`);
  return twilioClient.sendMessage({ from, to, body });
}
