
import Twilio from 'twilio';
import { twilio } from './globals';

const { accountSid, authToken } = twilio;

// create an authenticated Twilio REST API client
const twilioClient = new Twilio(accountSid, authToken);
export default twilioClient;
