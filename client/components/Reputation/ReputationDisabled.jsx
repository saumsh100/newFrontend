
import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.scss';

export default function ReputationDisabled({ activationText }) {
  const defaultText = 'The Reputation Page has not been activated. Please contact your CareCru account manager for further assistance.';
  return (
    <div className={styles.disabledPage}>
      <span className={styles.disabledPage_text}>{activationText || defaultText}</span>
    </div>
  );
}

ReputationDisabled.propTypes = {
  activationText: PropTypes.string.isRequired,
};
