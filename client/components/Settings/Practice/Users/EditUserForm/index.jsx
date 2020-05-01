
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';

const roleOptions = [{ value: 'OWNER' }, { value: 'ADMIN' }, { value: 'MANAGER' }];

export default function EditUserForm({ user, role, onSubmit }) {
  return (
    <Form
      enableReinitialize
      ignoreSaveButton
      onSubmit={onSubmit}
      form={`${user.get('id')}_editUserForm`}
      initialValues={{
        sendBookingRequestEmail: user.get('sendBookingRequestEmail'),
        role,
      }}
    >
      <Field
        name="sendBookingRequestEmail"
        label="Receive Email Notifications"
        component="Toggle"
      />
      <Field name="role" component="DropdownSelect" options={roleOptions} />
    </Form>
  );
}

EditUserForm.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
