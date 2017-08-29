import React, { Component, PropTypes } from 'react';
import { Card, Button } from '../library';
import styles from './styles.scss';
import CopyrightFooter from '../Login/CopyrightFooter/index';

export default function EmailSuccess(props) {
  const {
    email,
    push,
  } = props;

  return (
    <div className={styles.backDrop}>
      <Card className={styles.loginForm}>
        <div className={styles.logoContainer} >
          <img
            className={styles.loginLogo}
            src="/images/logo_black.png"
            alt="CareCru Logo"
          />
        </div>

        <p>
          We've sent an email to {email} with password reset instructions.
        </p>
        <p>
          If the email doesn't show up soon, check your spam folder. We sent it from noreply@carecru.com.
        </p>
        <Button
          onClick={()=> {
            push('/login');
          }}
          className={styles.displayCenter}
        >
          Return to Login
        </Button>
      </Card>
      <CopyrightFooter />
    </div>
  )
}

EmailSuccess.propTypes = {
  push: PropTypes.func.isRequired,
};
