
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../../library';
import { USER_ROLE_OPTIONS, OWNER_ROLE, SUPERADMIN_ROLE, ADMIN_ROLE } from '../user-role-constants';
import styles from '../styles.scss';

class EditUserForm extends Component {
  get currentUserIsAdmin() {
    return this.props.currentUserRole === ADMIN_ROLE;
  }

  get currentUserIsSuperAdmin() {
    return this.props.currentUserRole === SUPERADMIN_ROLE;
  }

  get currentUserIsOwner() {
    return this.props.currentUserRole === OWNER_ROLE;
  }

  get usernameInput() {
    const canEditUsername =
      this.currentUserIsSuperAdmin || this.currentUserIsOwner || this.currentUserIsAdmin;

    return (
      canEditUsername && (
        <div
          // only adds margin when needed
          className={
            this.currentUserIsSuperAdmin || this.currentUserIsOwner ? styles.usernameInput : ''
          }
        >
          <Field name="username" label="Email/Username" component="Input" />
        </div>
      )
    );
  }

  get sendBookingRequestEmailToggle() {
    const canEditBookingRequestEmail = this.currentUserIsSuperAdmin || this.currentUserIsOwner;

    return (
      canEditBookingRequestEmail && (
        <Field
          name="sendBookingRequestEmail"
          label="Receive Appointment Request Emails"
          component="Toggle"
        />
      )
    );
  }

  get roleDropdown() {
    const FILTERED_ROLE_OPTIONS = USER_ROLE_OPTIONS.filter((roleOption) => {
      if (this.currentUserIsSuperAdmin || this.currentUserIsOwner) return true;

      return roleOption.value !== OWNER_ROLE;
    });

    const canEditUserRole = this.currentUserIsSuperAdmin || this.currentUserIsOwner;

    return (
      canEditUserRole && (
        <Field
          name="role"
          label="Role"
          component="DropdownSelect"
          options={FILTERED_ROLE_OPTIONS}
        />
      )
    );
  }

  get ssoToggle() {
    const canEditSso = this.currentUserIsSuperAdmin;
    return canEditSso && <Field name="isSSO" label="Is SSO user?" component="Toggle" />;
  }

  render() {
    const { user, role, onSubmit } = this.props;
    return (
      <Form
        enableReinitialize
        ignoreSaveButton
        onSubmit={onSubmit}
        form={`${user && user.get('id')}_editUserForm`}
        initialValues={{
          sendBookingRequestEmail: user && user.get('sendBookingRequestEmail'),
          username: user && user.get('username'),
          role,
          isSSO: user && user.get('isSSO'),
        }}
      >
        {this.sendBookingRequestEmailToggle}
        {this.usernameInput}
        {this.roleDropdown}
        {this.ssoToggle}
      </Form>
    );
  }
}

EditUserForm.propTypes = {
  user: PropTypes.instanceOf(Map).isRequired,
  role: PropTypes.string.isRequired,
  currentUserRole: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditUserForm;
