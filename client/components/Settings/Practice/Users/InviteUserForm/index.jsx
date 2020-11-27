
import PropTypes from 'prop-types';
import React from 'react';
import { Form, Field } from '../../../../library';
import { emailValidate, asyncEmailValidateUser } from '../../../../library/Form/validate';
import { USER_ROLE_OPTIONS } from '../user-role-constants';
import styles from '../styles.scss';

const InviteUserForm = ({ sendInvite, formName, formStyle }) => (
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
      <Field name="role" label="User Role" component="DropdownSelect" options={USER_ROLE_OPTIONS} />
    </div>
  </Form>
);
InviteUserForm.propTypes = {
  formName: PropTypes.string,
  sendInvite: PropTypes.func.isRequired,
  formStyle: PropTypes.string,
};

InviteUserForm.defaultProps = {
  formName: null,
  formStyle: null,
};

export default InviteUserForm;
