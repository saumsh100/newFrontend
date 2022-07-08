import PropTypes from 'prop-types';
import React from 'react';
import { Card, Button } from '../library';
import styles from './reskin-styles.scss';

export default function EmailSuccess(props) {
  const { email, push } = props;

  return (
    <Card className={styles.loginForm}>
      <h1 className={styles.title}>Recovery Email has been sent</h1>
      <p className={styles.text}>
        We’ve sent an email to <span className={styles.email}>{email}</span> with the recovery link.
        Please make sure to check your spam folder as well. We sent the email from{' '}
        <span className={styles.email}>noreply@carecru.com</span>.
      </p>
      <div className={styles.buttonContainer}>
        {/* <Button
          onClick={() => handleResend()}
          className={styles.displayCenter}
          border="blue"
          disable={resented}
        >
          Resend Email
        </Button> */}
        <Button
          onClick={() => {
            push('/login');
          }}
          className={styles.displayCenter}
        >
          Return to Sign In
        </Button>
      </div>
    </Card>
  );
}

EmailSuccess.propTypes = {
  email: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired,
};
