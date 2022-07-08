import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../../components/Button';
import styles from './styles.scss';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';

function ResetSuccess({ history }) {
  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Password Reset Sent</h1>
          <p className={styles.description}>
            {`We've sent you an email with password reset instructions. If the email doesn't show up
            soon, please check your spam folder. We sent the email from noreply@carecru.com.`}
          </p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <Button
            onClick={() => {
              history.push('./login');
            }}
            className={styles.actionButton}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ResetSuccess);

ResetSuccess.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
};
