import axios from 'axios';

const validate = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required firstName'
  } else if (values.firstName.length > 15) {
    errors.username = 'Must be 15 characters or less'
  }

  if (!values.lastName) {
    errors.lastName = 'Required lastName'
  } else if (values.lastName.length > 15) {
    errors.username = 'Must be 15 characters or less'
  }

  if (!values.phone) {
    errors.phone = 'Required phone'
  } else if (!/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s.]{0,1}[0-9]{3}[-\s.]{0,1}[0-9]{4}$/i.test(values.phone)) {
    errors.phone = 'Invalid phone number'
  }

  if (!values.email) {
    errors.email = 'Required email'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password && !values.confirmPassword) {
    errors.password = 'Required password';
    errors.confirmPassword = 'Required password';
  }

  if (values.password !== values.confirmPassword) {
    errors.password = 'Password is not match';
    errors.confirmPassword = 'Password is not match';

  }

  return errors
};

const asyncEmailValidate = (values) => {
  return axios.get('patients/', { params: { email: values.email }})
    .then((response) => {
      if (response.data.length) {
       throw { email: `patient with ${values.email} already exists... ` }
      }
    })
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
        throw { email: `User with ${values.email} already exists... ` }
      }
    })
}

export {
  validate,
  asyncEmailValidate,
  asyncEmailValidateUser,
  maxLength,
  emailValidate,
  passwordsValidate,
};
