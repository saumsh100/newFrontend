import React, { PropTypes, Component } from 'react';
import { Form, Field } from '../../../../library';
import { validate } from '../../../../library/Form/validate'

class InviteUserForm extends Component {

  render() {
    const { sendInvite, formName, mainStyle, formStyle } = this.props;
    return (
      <div className={mainStyle}>
        <Form
          className={formStyle}
          form={formName}
          validate={validate}
          onSubmit={sendInvite}
          ignoreSaveButton
        >
          <Field
            required
            type="email"
            name="email"
            label="Email"
          />
        </Form>
      </div>
    );
  }
}

InviteUserForm.PropTypes = {
  formName: PropTypes.string,
  sendInvite: PropTypes.func.isRequired,
};


export default InviteUserForm;
