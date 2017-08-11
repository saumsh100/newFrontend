import React, { PropTypes, Component } from 'react';
import { Form, Field } from '../../../../library';
import { emailValidate, asyncEmailValidateUser } from '../../../../library/Form/validate';

class InviteUserForm extends Component {

  render() {
    const { sendInvite, formName, mainStyle, formStyle } = this.props;

    const optionsInterval = [
      {
        value: 'OWNER',
      },
      {
        value: 'ADMIN',
      },
      {
        value: 'MANAGER',
      },
    ];

    return (
      <Form
        className={formStyle}
        form={formName}
        onSubmit={sendInvite}
        asyncValidate={asyncEmailValidateUser}
        ignoreSaveButton
      >
        <Field
          required
          validate={[emailValidate]}
          type="email"
          name="email"
          label="Email"
          data-test-id="email"
        />
        <Field
          name="role"
          label="User Role"
          component="DropdownSelect"
          options={optionsInterval}
        />
      </Form>
    );
  }
}

InviteUserForm.PropTypes = {
  formName: PropTypes.string,
  sendInvite: PropTypes.func.isRequired,
  mainStyle: PropTypes.object,
  formStyle: PropTypes.object,
};


export default InviteUserForm;
