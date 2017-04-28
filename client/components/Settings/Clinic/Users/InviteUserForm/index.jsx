import React, {PropTypes, Component} from 'react';
import { Header, Row, Form, Field } from '../../../../library';
import { validate } from '../../../../library/Form/validate'
import styles from '../styles.scss';


class InviteUserForm extends Component {

  render() {
    const { sendInvite, formName } = this.props;
    return (
      <div className={styles.emailInvite}>
        <Form
          className={styles.form}
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
