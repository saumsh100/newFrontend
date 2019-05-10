
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import styles from './styles.scss';

export default function SMSPreview(props) {
  const { from, message } = props;

  return (
    <div className={styles.smsWrapper}>
      <div className={styles.headerSection}>
        <div className={styles.leftSection}>
          <div className={styles.smsIcon}>
            <Icon icon="comment" type="solid" />
          </div>
          <div className={styles.title}>MESSAGES</div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.titleText}>now</div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.from}>{from}</div>
        <div className={styles.message}>{message}</div>
      </div>
    </div>
  );
}

SMSPreview.propTypes = {
  from: PropTypes.string.isRequired,
  message: PropTypes.string,
};

SMSPreview.defaultProps = {
  message: null,
};
