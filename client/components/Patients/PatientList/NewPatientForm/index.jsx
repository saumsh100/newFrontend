import React, { PropTypes } from 'react';
import { Form, Field, DayPicker } from '../../../library';

import { maxLength, asyncEmailValidateUser, emailValidate, phoneValidate } from '../../../library/Form/validate';


export default function Invite({ onSubmit, saveBirthday, birthday, formName }) {

  return (
    <Form form={formName}
          onSubmit={onSubmit}
          ignoreSaveButton={true}
    >
      <Field
        required
        name="firstName"
        validate={[maxLength(15)]}
        label="First Name"
      />
      <Field
        required
        name="lastName"
        validate={[maxLength(15)]}
        label="Last Name"
      />
      <Field
        required
        name="gender"
        validate={[maxLength(15)]}
        label="Gender"
      />
      <Field
        required
        name="phoneNumber"
        validate={[phoneValidate]}
        label="Phone Number"
      />
      <Field
        required
        type="email"
        name="email"
        validate={[emailValidate]}
        label="Email"
      />
      <DayPicker
        required
        name="birthDate"
        value={birthday}
        onChange={saveBirthday}
        label="Birth Date"
      />
    </Form>
  );
}

Invite.propTypes = {
  formName: PropTypes.string,
  saveBirthday: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
