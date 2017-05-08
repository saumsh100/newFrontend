import axios from 'axios';

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

  return undefined;
};

const passwordsValidate = (value, values) => {
  if (values.password !== values.confirmPassword) {
    return 'Password is not match';
  }

  return undefined;
};

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined

const asyncEmailValidateUser = (values) => {
  return axios.post('/userCheck', { email: values.email })
    .then((response) => {
      if (response.data.exists === true) {
        throw { email: `User with ${values.email} already exists... ` };
      }
    });
};

export {
  asyncEmailValidatePatient,
  asyncEmailValidateUser,
  maxLength,
  emailValidate,
  passwordsValidate,
};
