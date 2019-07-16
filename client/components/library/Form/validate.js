
import zxcvbn from 'zxcvbn';
import moment from 'moment';
import { httpClient, bookingWidgetHttpClient } from '../../../util/httpClient';

const asyncEmailValidatePatient = ({ email }) => {
  if (!email) return;
  return bookingWidgetHttpClient()
    .post('/patientUsers/email', { email })
    .then(({ data }) => {
      if (data.exists) {
        throw { email: 'There is already a user with that email' };
      }
    });
};

const asyncPhoneNumberValidatePatient = ({ phoneNumber }) => {
  if (!phoneNumber) return undefined;
  return bookingWidgetHttpClient()
    .post('/patientUsers/phoneNumber', { phoneNumber })
    .catch(({ response: { data } }) => {
      throw { phoneNumber: data };
    });
};

const asyncValidatePatient = composeAsyncValidators([
  asyncEmailValidatePatient,
  asyncPhoneNumberValidatePatient,
]);

function composeAsyncValidators(validatorFns) {
  return async (values, dispatch, props, field) => {
    let errors;
    for (const validatorFn of validatorFns) {
      try {
        console.log('running validatorFn');
        await validatorFn(values, dispatch, props, field);
      } catch (err) {
        console.log('err', err);
        errors = Object.assign({}, errors, err);
      }
    }

    if (errors) {
      console.log('errors', errors);
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
  if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) &&
    value !== undefined &&
    value !== null
  ) {
    return 'Invalid email address';
  }
};

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
    ) &&
    value !== null &&
    value !== '' &&
    value !== undefined
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

const passwordsValidate = (value, values) => {
  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    return 'Password is not match';
  }

  return undefined;
};

const passwordsMatch = (values) => {
  const errors = {};
  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);

const asyncEmailValidateUser = values =>
  httpClient()
    .post('/userCheck', { email: values.email })
    .then(
      response =>
        response.data.exists !== true ||
        Promise.reject({ email: `User with ${values.email} already exists...` }),
    );

const asyncEmailPasswordReset = values =>
  httpClient()
    .post('/userCheck', { email: values.email })
    .then((response) => {
      if (response.data.exists !== true) {
        return { email: 'User with this email does not exist' };
      }
    });

const numDigitsValidate = max => (value) => {
  if (!value || value.length >= max) return;
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
  if (!value) return;
  const result = zxcvbn(value);
  const {
    score,
    feedback: { warning },
  } = result;
  if (score < 1) {
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
};
