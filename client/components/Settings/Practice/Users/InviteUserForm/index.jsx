
import PropTypes from 'prop-types';
import React from 'react';
import { Form, Field } from '../../../../library';
import { emailValidate, asyncEmailValidateUser } from '../../../../library/Form/validate';
import { USER_ROLE_OPTIONS, OWNER_ROLE, SUPERADMIN_ROLE } from '../user-role-constants';
import styles from '../styles.scss';

const InviteUserForm = ({ sendInvite, formName, formStyle, currentUserRole }) => {
  const FILTERED_ROLE_OPTIONS = USER_ROLE_OPTIONS.filter((roleOption) => {
    if (currentUserRole === SUPERADMIN_ROLE || currentUserRole === OWNER_ROLE) return true;

    return roleOption.value !== OWNER_ROLE;
  });
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
          options={FILTERED_ROLE_OPTIONS}
        />
      </div>
    </Form>
  );
};
InviteUserForm.propTypes = {
  formName: PropTypes.string,
  sendInvite: PropTypes.func.isRequired,
  formStyle: PropTypes.string,
  currentUserRole: PropTypes.string.isRequired,
};

InviteUserForm.defaultProps = {
  formName: null,
  formStyle: null,
};

export default InviteUserForm;
