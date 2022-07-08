import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import { StandardButton, Icon } from '../../library';

const SuccessChange = ({ backToLoginScreen }) => {
  return (
    <div className={styles.container}>
      <Icon icon="check" className={styles.icon} />
      <h1 className={styles.title}>Password Changed</h1>
      <p className={styles.textSuccess}>Your password has been successfully changed.</p>
      <StandardButton
        variant="success"
        onClick={backToLoginScreen}
        className={styles.displayCenter}
      >
        Return to Sign In
      </StandardButton>
    </div>
  );
};

SuccessChange.propTypes = {
  backToLoginScreen: PropTypes.func.isRequired,
};

export default SuccessChange;
