import React, {Proptypes, Component} from 'react';
import { Header, Row, Form, Field } from '../../../../library';
import styles from '../styles.scss';


class InviteUserForm extends Component {

  render() {
    const { sendInvite } = this.props;
    return (
      <div className={styles.emailInvite}>
        <Form
          className={styles.form}
          form="generalSettingsForm"
          onSubmit={sendInvite}
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


export default InviteUserForm;
