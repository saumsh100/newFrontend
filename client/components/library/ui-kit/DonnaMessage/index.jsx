
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const DonnaMessage = ({ dataLoading, accountName }) => (
  <div className={styles.wrapper}>
    <img src="/images/donna.png" alt="Donna" className={styles.donna} />
    <div className={styles.message}>
      <p>{`Working hard to ${dataLoading} for ${accountName}`}</p>
      <span className={styles.signature}>- Donna</span>
    </div>
  </div>
);

DonnaMessage.propTypes = {
  dataLoading: PropTypes.string,
  accountName: PropTypes.string,
};

DonnaMessage.defaultProps = {
  dataLoading: 'load fake data',
  accountName: 'My PMS',
};

export default DonnaMessage;
