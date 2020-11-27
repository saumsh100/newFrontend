
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import { USER_ROLE_OPTIONS, OWNER_ROLE, SUPERADMIN_ROLE } from '../user-role-constants';

const EditUserForm = ({ user, role, onSubmit, currentUserRole }) => {
  const FILTERED_ROLE_OPTIONS = USER_ROLE_OPTIONS.filter((roleOption) => {
    if (currentUserRole === SUPERADMIN_ROLE || currentUserRole === OWNER_ROLE) return true;

    return roleOption.value !== OWNER_ROLE;
  });
  return (
    <Form
      enableReinitialize
      ignoreSaveButton
      onSubmit={onSubmit}
      form={`${user.get('id')}_editUserForm`}
      initialValues={{
        sendBookingRequestEmail: user.get('sendBookingRequestEmail'),
        role,
        isSSO: user.get('isSSO'),
      }}
    >
      <Field
        name="sendBookingRequestEmail"
        label="Receive Appointment Request Emails"
        component="Toggle"
      />
      <Field name="role" component="DropdownSelect" options={FILTERED_ROLE_OPTIONS} />
      <Field name="isSSO" label="Is SSO user?" component="Toggle" />
    </Form>
  );
};

EditUserForm.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  currentUserRole: PropTypes.string.isRequired,
};

export default EditUserForm;
