
import React, { Component } from 'react';
import { Link } from '../../library';
import styles from './styles.scss';

class Success extends Component {
  render() {
    return (
      <div className={styles.loginWrapper}>
        <p>
          We've sent you an email with password reset instructions.
        </p>
        <p>
          If the email doesn't show up soon, please check your spam folder. We sent the email from <span className={styles.email}>noreply@carecru.com</span>.
        </p>
        <div className={styles.linkWrapper}>
          <Link to="./login">
            Back to login
          </Link>
        </div>
      </div>
    );
  }
}

export default Success;
