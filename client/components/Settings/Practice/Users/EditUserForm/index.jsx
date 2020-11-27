
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import { USER_ROLE_OPTIONS } from '../user-role-constants';

const EditUserForm = ({ user, role, onSubmit }) => (
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
    <Field name="role" component="DropdownSelect" options={USER_ROLE_OPTIONS} />
    <Field name="isSSO" label="Is SSO user?" component="Toggle" />
  </Form>
);

EditUserForm.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditUserForm;
