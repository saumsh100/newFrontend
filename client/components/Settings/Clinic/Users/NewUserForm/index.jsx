import React, { PropTypes, Component } from 'react';
import { Form, Field } from '../../../../library';
import { emailValidate, maxLength, passwordsValidate, passwordStrength, asyncEmailValidateUser } from '../../../../library/Form/validate';

class NewUserForm extends Component {

  render() {
    const { sendNewUser, formName, mainStyle, formStyle } = this.props;
    return (
      <Form
        className={formStyle}
        form={formName}
        onSubmit={sendNewUser}
        asyncValidate={asyncEmailValidateUser}
        ignoreSaveButton
      >
        <Field
          required
          validate={[maxLength(25)]}
          name="firstName"
          label="First Name"
        />
        <Field
          required
          validate={[maxLength(25)]}
          name="lastName"
          label="Last Name"
        />
        <Field
          required
          validate={[emailValidate]}
          type="email"
          name="email"
          label="Email"
        />
        <Field
          required
          name="role"
          label="Role"
          component="DropdownSelect"
          options={[
            { value: 'ADMIN' },
            { value: 'OWNER' },
            { value: 'MANAGER' },
          ]}
        />
        <Field
          required
          type="password"
          name="password"
          validate={[passwordsValidate, passwordStrength]}
          label="Password"
        />
        <Field
          required
          type="password"
          name="confirmPassword"
          validate={[passwordsValidate, passwordStrength]}
          label="Password Confirmation"
        />
      </Form>
    );
  }
}

NewUserForm.PropTypes = {
  formName: PropTypes.string,
  sendNewUser: PropTypes.func.isRequired,
  mainStyle: PropTypes.object,
  formStyle: PropTypes.object,
};


export default NewUserForm;
