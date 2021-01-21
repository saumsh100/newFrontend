
import zxcvbn from 'zxcvbn';
import moment from 'moment';
import { httpClient, bookingWidgetHttpClient } from '../../../util/httpClient';

const asyncEmailValidatePatient = ({ email }) => {
  if (!email) return null;
  return bookingWidgetHttpClient()
    .post('/patientUsers/email', { email })
    .then(({ data }) => {
      if (data.exists) {
        throw Object.assign(new Error(), { email: 'There is already a user with that email' });
      }
    })
    .catch((error) => {
      throw Object.assign(new Error(), { email: error.response?.data });
    });
};

const asyncPhoneNumberValidatePatient = ({ phoneNumber }) => {
  if (!phoneNumber) return undefined;
  return bookingWidgetHttpClient()
    .post('/patientUsers/phoneNumber', { phoneNumber })
    .catch((error) => {
      throw Object.assign(new Error(), { phoneNumber: error.response?.data });
    });
};

const asyncValidatePatient = composeAsyncValidators([
  asyncEmailValidatePatient,
  asyncPhoneNumberValidatePatient,
]);

function composeAsyncValidators(validatorFns) {
  return async (values, dispatch, props, field) => {
    let errors;
    const results = validatorFns.map(validatorFn => validatorFn(values, dispatch, props, field));
    await Promise.allSettled(results)
      .then((responses) => {
        responses.forEach((response) => {
          if (response.status === 'rejected') {
            const error = { ...response.reason };
            delete error.stack;
            errors = Object.assign({}, errors, error);
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });

    if (errors) {
      throw errors;
    }
  };
}

const phoneValidate = (value) => {
  if (
    !/(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i.test(
      value,
    )
  ) {
    return 'Invalid phone Number';
  }

  return undefined;
};

const emailValidate = (value) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!value || !re.test(String(value).toLowerCase())) {
    return 'Invalid email address';
  }
};

/**
 * validate comma separated emails string
 */
function validateEmails(str) {
  if (!str) {
    return null;
  }

  const emails = str.split(',');
  // get rid of empty spaces
  const trimmedEmails = emails.map(email => email.trim());
  // check how many invalid emails are in the array
  const invalidEmails = trimmedEmails
    .map(email => emailValidate(email))
    .filter(val => typeof val === 'string');

  if (invalidEmails.length > 0) {
    return 'Invalid email addresses';
  }

  return null;
}

const leftTrim = value => value.replace(/^\s+/g, '');

const phoneNumberValidate = (value) => {
  if (
    !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(value)
  ) {
    return 'Invalid phone number';
  }
};

const phoneValidateNullOkay = (value) => {
  if (
    !/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
      value,
    )
    && value !== null
    && value !== ''
    && value !== undefined
  ) {
    return 'Invalid phone number';
  }
};

const postalCodeValidate = (value) => {
  const can = new RegExp(
    /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
  );
  if (!can.test(value) && value !== undefined) {
    return 'Invalid Postal Code';
  }
};

const isSamePassword = ({ password, confirmPassword }) =>
  password && confirmPassword && password !== confirmPassword;

const passwordsValidate = (value, values) => {
  if (isSamePassword(values)) {
    return 'Password is not match';
  }

  return undefined;
};

const passwordsMatch = (values) => {
  const errors = {};
  if (isSamePassword(values)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);

const asyncEmailValidateUser = ({ email }) =>
  email
  && httpClient()
    .post('/userCheck', { email })
    .then(
      response =>
        response.data.exists !== true
        || Promise.reject(
          Object.assign(new Error(), { email: `User with ${email} already exists...` }),
        ),
    );

const asyncEmailPasswordReset = ({ email }) =>
  email
  && httpClient()
    .post('/userCheck', { email })
    .then((response) => {
      if (response.data.exists !== true) {
        return { email: 'User with this email does not exist' };
      }
    });

const numDigitsValidate = max => (value) => {
  if (!value || value.length >= max) return null;
  return 'Not enough digits';
};

const compose = validators => (values) => {
  let errors = {};
  validators.forEach((validate) => {
    errors = Object.assign({}, errors, validate(values));
  });

  return errors;
};

const passwordStrength = (value) => {
  if (!value) return null;
  const result = zxcvbn(value);
  const {
    score,
    feedback: { warning },
  } = result;
  if (score <= 1 || warning) {
    return warning || 'Password not strong enough';
  }
};

const parseNum = value => value && parseInt(value, 10);

const notNegative = value => (value && value <= 0 ? 'Must be greater than 0' : undefined);

const normalizeBirthdate = value => value.trim();

const validateBirthdate = (value) => {
  const format = 'MM/DD/YYYY';
  const pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

  if (!pattern.test(value) && value !== undefined && value !== null) {
    return format;
  }
  const date = moment(value, format);
  const isValid = date.isValid();
  if (!isValid && value !== undefined && value !== null) {
    return format;
  }
};

const onlyNumber = (value) => {
  if (!value) return undefined;

  const regex = /^[+-]?\d+$/g;
  if (!regex.test(value)) {
    return 'Need to be a number';
  }
  return undefined;
};

export {
  leftTrim,
  composeAsyncValidators,
  asyncValidatePatient,
  asyncEmailValidatePatient,
  asyncPhoneNumberValidatePatient,
  asyncEmailPasswordReset,
  asyncEmailValidateUser,
  maxLength,
  emailValidate,
  phoneNumberValidate,
  passwordsValidate,
  passwordsMatch,
  compose,
  passwordStrength,
  numDigitsValidate,
  phoneValidate,
  postalCodeValidate,
  phoneValidateNullOkay,
  parseNum,
  notNegative,
  normalizeBirthdate,
  validateBirthdate,
  onlyNumber,
  validateEmails,
};
