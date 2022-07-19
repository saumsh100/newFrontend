import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const DonnaMessage = ({ message, accountName }) => (
  <div className={styles.wrapper}>
    <img src="/images/donna.svg" alt="Donna" className={styles.donna} />
    <div className={styles.message}>
      <p>{`Working hard to ${message} for ${accountName}`}</p>
      <span className={styles.signature}>- Donna</span>
    </div>
  </div>
);

DonnaMessage.propTypes = {
  message: PropTypes.string,
  accountName: PropTypes.string,
};

DonnaMessage.defaultProps = {
  message: 'load fake data',
  accountName: 'My PMS',
};

export default DonnaMessage;
