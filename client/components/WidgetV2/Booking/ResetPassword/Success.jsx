
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from '../../../library';
import styles from './styles.scss';

function ResetSuccess() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h3 className={styles.title}>Password Reset Sent</h3>
          <p className={styles.subtitle}>
            We've sent you an email with password reset instructions. If the email doesn't show up
            soon, please check your spam folder. We sent the email from noreply@carecru.com.
          </p>
          <Link to={'./login'}>
            <span className={styles.subCardLink}>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ResetSuccess);
