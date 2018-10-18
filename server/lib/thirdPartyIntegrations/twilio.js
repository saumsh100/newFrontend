
import twilioClient from '../../config/twilio';
import StatusError from '../../util/StatusError';
import getAreaCode from '../../../iso/helpers/string/getAreaCode';
import fieldsValidator from '../../../iso/helpers/validators/fieldsValidators';
import { host } from '../../../server/config/globals';

/**
 * find an available phone number and purchase it in twilio, then update the CareCru account with
 * that phone number
 * @param account
 * @returns {Promise<Account>}
 */
export async function twilioSetup(account) {
  fieldsValidator(account, [
    'address.state',
    'address.country',
    'destinationPhoneNumber',
  ]);

  if (account.twilioPhoneNumber) {
    throw StatusError(StatusError.BAD_REQUEST, 'This account already has twilioPhoneNumber');
  }

  try {
    const phoneNumber = await getAvailableNumber(account);
    await twilioClient.incomingPhoneNumbers.create({
      phoneNumber,
      friendlyName: account.name,
      smsUrl: `https://${host}/twilio/sms/accounts/${account.id}`,
    });
    return account.update({ twilioPhoneNumber: phoneNumber });
  } catch (e) {
    console.error('Twilio Number Creation Failed');
    console.error(e);
    throw StatusError(e.status, e.message);
  }
}

/**
 * Find and delete the phone number associated with the CareCru account in twilio, then update the
 * account
 * @param account
 * @returns {Promise<Account>}
 */
export async function twilioDelete(account) {
  fieldsValidator(account, ['twilioPhoneNumber']);

  try {
    const { incomingPhoneNumbers } = await twilioClient.incomingPhoneNumbers.list();
    const phoneNumber = incomingPhoneNumbers.find(({ phone_number }) => account.twilioPhoneNumber === phone_number);

    if (!phoneNumber) {
      throw StatusError(StatusError.BAD_REQUEST, 'Twilio Number Not Found');
    }

    await twilioClient.incomingPhoneNumbers(phoneNumber.sid).delete();
    return account.update({ twilioPhoneNumber: null });
  } catch (e) {
    console.error('Twilio Number Delete Failed');
    console.error(e);
    throw StatusError(e.status, e.message);
  }
}

/**
 * Find an available number in an order of postal code, area code then state.
 * Throws errors when doesn't find any number
 * @param account
 * @returns {Promise<string>} phoneNumber
 */
async function getAvailableNumber({ address, destinationPhoneNumber }) {
  const defaultOpts = {
    smsEnabled: true,
    voiceEnabled: true,
  };

  const opts = [
    {
      ...defaultOpts,
      InPostalCode: address.zipCode,
    },
    {
      ...defaultOpts,
      areaCode: getAreaCode(destinationPhoneNumber),
    },
    {
      ...defaultOpts,
      inRegion: address.state,
    },
  ];

  for (const option of opts) {
    // eslint-disable-next-line no-await-in-loop
    const { availablePhoneNumbers } = await twilioClient
      .availablePhoneNumbers(address.country)
      .local.list(option);

    if (availablePhoneNumbers.length > 0) {
      return availablePhoneNumbers[0].phone_number;
    }
  }
  throw new Error('No available phone numbers in Twilio');
}
