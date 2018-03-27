
const compromise = require('compromise');

const SMS_KEY = 'sms';
const EMAIL_KEY = 'emailNotifications';
const PHONE_KEY = 'phone';

const lexicon = {
  sms: 'SMS',
  txt: 'SMS',
  txts: 'SMS',
  text: 'SMS',
  texts: 'SMS',
  texting: 'SMS',
  phone: 'PHONE',
  call: 'PHONE',
  calls: 'PHONE',
  calling: 'PHONE',
  cell: 'PHONE',
  email: 'EMAIL',
  emailing: 'EMAIL',
  emails: 'EMAIL',
  ['e\-mail']: 'EMAIL',
};

const has = (c, phrase) => !!c.match(phrase).out();

/**
 * convertToCommsPreferences will accept a string (mostly contact method notes)
 * and do natural language processing to determine that communication preferences
 * that are within the note
 *
 * @param str
 * @return preferences {{sms: boolean, email: boolean, phone: boolean}}
 */
module.exports = function convertToCommsPreferences(str) {
  str = str || '';
  str = str.toLowerCase();
  str = str.replace(new RegExp('/', 'g'), ' or ');
  const c = compromise(str, lexicon);

  if (has(c, '(only|just) * #SMS') || has(c, '#SMS * (only|just)')) {
    return {
      [SMS_KEY]: true,
      [EMAIL_KEY]: false,
      [PHONE_KEY]: false,
    };
  } else if (has(c, '(only|just) * #EMAIL') || has(c, '#EMAIL * (only|just)')) {
    return {
      [SMS_KEY]: false,
      [EMAIL_KEY]: true,
      [PHONE_KEY]: false,
    };
  } else if (has(c, '(only|just) * #PHONE') || has(c, '#PHONE * (only|just)')) {
    return {
      [SMS_KEY]: false,
      [EMAIL_KEY]: false,
      [PHONE_KEY]: true,
    };
  }

  return {
    [SMS_KEY]: !(has(c, 'do not * #SMS') || has(c, 'no * #SMS')),
    [EMAIL_KEY]: !(has(c, 'do not * #EMAIL') || has(c, 'no * #EMAIL')),
    [PHONE_KEY]: !(has(c, 'do not * #PHONE') || has(c, 'no * #PHONE')),
  };
};
