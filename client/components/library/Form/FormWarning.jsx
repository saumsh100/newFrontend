
import React from 'react';
import PropTypes from 'prop-types';
import styles from './formWarning.scss';
import { Icon } from '..';

export default function FormWarning({ message, onClose }) {
  return (
    <div className={styles.warningWrapper}>
      <Icon icon="exclamation-circle" className="fas" style={{ color: ' rgb(250, 170, 20)' }} />
      <p className={styles.warningMessage}>{message}</p>
      <button type="button" onClick={onClose}>
        <Icon icon="times" className="fal" style={{ color: 'rgb(202, 205, 208)' }} />
      </button>
    </div>
  );
}

FormWarning.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
