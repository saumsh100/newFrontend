import React, {Proptypes, Component} from 'react';
import { Header, Row, Form, Field } from '../../../../library';
import styles from '../styles.scss';


class InviteUser extends Component {

  render() {
    const { sendInvite } = this.props;
    return (
      <Row className={styles.emailInvite}>
        <Header className={styles.emailHeader}>Enter Email to send Invite:</Header>
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
      </Row>
    );
  }
}


export default InviteUser;
