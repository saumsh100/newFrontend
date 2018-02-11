
import axios from 'axios';
import zxcvbn from 'zxcvbn';

const asyncEmailValidatePatient = (values) => {
  if (!values.email) return;
  return axios.post('/patientUsers/email', { email: values.email })
    .then((response) => {
      if (response.data.exists) {
        throw { email: 'There is already a user with that email' };
      }
    });
};

const asyncPhoneNumberValidatePatient = (values) => {
  if (!values.phoneNumber) return;
  return axios.post('/patientUsers/phoneNumber', { phoneNumber: values.phoneNumber })
    .then((response) => {
      const { error } = response.data;
      if (error) {
        throw { phoneNumber: error };
      }
    });
};

const asyncEmailValidateNewPatient = (values) => {
  if (!values.email) return;
  return axios.post('/api/patients/emailCheck', { email: values.email })
    .then((response) => {
      if (response.data.exists) {
        throw { email: 'There is already a user with that email' };
      }
    });
};

const asyncPhoneNumberValidateNewPatient = (values) => {
  if (!values.mobilePhoneNumber) return;
  // TODO: Check for valid mobile phone number
  return axios.post('/api/patients/phoneNumberCheck', { phoneNumber: values.mobilePhoneNumber })
    .then((response) => {
      if (response.data.exists) {
        throw { mobilePhoneNumber: 'There is already a user with that phone number' };
      }
    });
};


const asyncValidatePatient = composeAsyncValidators([asyncEmailValidatePatient, asyncPhoneNumberValidatePatient]);
const asyncValidateNewPatient = composeAsyncValidators(([asyncEmailValidateNewPatient, asyncPhoneNumberValidateNewPatient]));

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
  if (!/(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i.test(value)) {
    return 'Invalid phone Number';
  }

  return undefined;
};

const emailValidate = (value) => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) && value !== undefined) {
    return 'Invalid email address';
  }
};

const phoneNumberValidate = (value) => {
  if (!/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(value)) {
    return 'Invalid phone number';
  }
};

const phoneValidateNullOkay = (value) => {
  if (!/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(value) && value !== null && value !== '' && value !== undefined) {
    return 'Invalid phone number';
  }
};

const postalCodeValidate = (value) => {
  const can = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
  if (!can.test(value) && value !== undefined) {
    return 'Invalid Postal Code';
  }
}

const passwordsValidate = (value, values) => {
  if (values.password && values.confirmPassword && (values.password !== values.confirmPassword)) {
    return 'Password is not match';
  }

  return undefined;
};


const passwordsMatch = (values) => {
  const errors = {};
  if (values.password && values.confirmPassword && (values.password !== values.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};


const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

const asyncEmailValidateUser = values =>
  axios.post('/userCheck', { email: values.email })
    .then(response =>
      (response.data.exists !== true) ||
        Promise.reject({ email: `User with ${values.email} already exists...` })
    );

const asyncEmailPasswordReset = values =>
  axios.post('/userCheck', { email: values.email })
    .then((response) => {
      if (response.data.exists !== true) {
        return { email: 'User with this email does not exist' }
      }
    });

const numDigitsValidate = max => (value) => {
  if (!value || value.length >= max) return;
  return 'Not enough digits';
};

const compose = (validators) => (values) => {
  let errors = {};
  validators.forEach((validate) => {
    errors = Object.assign({}, errors, validate(values));
  });

  return errors;
};

const passwordStrength = (value) => {
  if (!value) return;
  const result = zxcvbn(value);
  const { score, feedback: { warning } } = result;
  if (score < 1) {
    return warning || 'Password not strong enough';
  }
};

const parseNum = value => value && parseInt(value);

const notNegative = value => value && value <= 0 ? 'Negative value' : undefined;

export {
  composeAsyncValidators,
  asyncValidatePatient,
  asyncValidateNewPatient,
  asyncEmailValidatePatient,
  asyncEmailValidateNewPatient,
  asyncPhoneNumberValidatePatient,
  asyncPhoneNumberValidateNewPatient,
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
};
