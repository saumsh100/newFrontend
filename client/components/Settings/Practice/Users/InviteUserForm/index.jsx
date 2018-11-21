
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Field } from '../../../../library';
import { emailValidate, asyncEmailValidateUser } from '../../../../library/Form/validate';
import styles from '../styles.scss';

class InviteUserForm extends Component {
  render() {
    const { sendInvite, formName, mainStyle, formStyle } = this.props;

    const optionsInterval = [{ value: 'OWNER' }, { value: 'ADMIN' }, { value: 'MANAGER' }];

    return (
      <Form
        className={formStyle}
        form={formName}
        onSubmit={sendInvite}
        asyncValidate={asyncEmailValidateUser}
        ignoreSaveButton
      >
        <div className={styles.inviteFormContainer}>
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
        </div>
      </Form>
    );
  }
}

InviteUserForm.propTypes = {
  formName: PropTypes.string,
  sendInvite: PropTypes.func.isRequired,
  mainStyle: PropTypes.string,
  formStyle: PropTypes.string,
};

InviteUserForm.defaultProps = {
  formName: null,
  mainStyle: null,
  formStyle: null,
};

export default InviteUserForm;
