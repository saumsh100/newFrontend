
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../library';

export default function EmailSuccess(props) {
  const { email, push, styles } = props;

  return (
    <div className={styles.formWrapper}>
      <p className={styles.text}>
        We've sent an email to <span className={styles.email}>{email}</span>{' '}
        with password reset instructions.
      </p>
      <p className={styles.text_only_bot_padding}>
        If the email doesn't show up soon, please check your spam folder. We
        sent the email from{' '}
        <span className={styles.email}>noreply@carecru.com</span>.
      </p>
      <p className={styles.text_only_bot_padding}>
        <Button
          onClick={() => {
            push('/login');
          }}
          className={styles.displayCenter}
        >
          Return to Login
        </Button>
      </p>
    </div>
  );
}

EmailSuccess.propTypes = {
  push: PropTypes.func.isRequired,
  email: PropTypes.string,
  styles: PropTypes.shape({
    formWrapper: PropTypes.string,
    text: PropTypes.string,
    text_only_bot_padding: PropTypes.string,
    email: PropTypes.string,
    displayCenter: PropTypes.string,
  }),
};
