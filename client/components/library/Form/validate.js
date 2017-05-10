
import axios from 'axios';
import zxcvbn from 'zxcvbn';

const asyncEmailValidatePatient = (values) => {
  return axios.post('/patientCheck', { email: values.email })
    .then((response) => {
      if (response.data.exists === true) {
        throw { email: 'There is already a user with that email' };
      }
    });
};

const emailValidate = (value) => {
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
};

const phoneNumberValidate = (value) => {
  if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
    return 'Invalid phone number';
  }
};


const passwordsValidate = (value, values) => {
  if (values.password !== values.confirmPassword) {
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

const asyncEmailValidateUser = (values) => {
  return axios.post('/userCheck', { email: values.email })
    .then((response) => {
      if (response.data.exists === true) {
        throw { email: `User with ${values.email} already exists...` };
      }
    });
};

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
  if (score < 2) {
    return warning || 'New password not strong enough';
  }
};

export {
  asyncEmailValidatePatient,
  asyncEmailValidateUser,
  maxLength,
  emailValidate,
  phoneNumberValidate,
  passwordsValidate,
  passwordsMatch,
  compose,
  passwordStrength,
  numDigitsValidate,
};
