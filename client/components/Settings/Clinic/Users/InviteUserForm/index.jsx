import React, { PropTypes, Component } from 'react';
import { Form, Field } from '../../../../library';
import { emailValidate } from '../../../../library/Form/validate';

class InviteUserForm extends Component {

  render() {
    const { sendInvite, formName, mainStyle, formStyle } = this.props;
    return (
      <Form
        className={formStyle}
        form={formName}
        onSubmit={sendInvite}
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
