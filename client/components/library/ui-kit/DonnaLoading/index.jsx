
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';
import DonnaMessage from '../DonnaMessage';

const LoadingBars = () => (
  <div className={styles.loadBar}>
    <div className={styles.bar} />
    <div className={styles.bar} />
    <div className={styles.bar} />
  </div>
);

const DonnaLoading = ({ accountName, message, isLoading }) =>
  isLoading && (
    <div>
      <LoadingBars />
      <DonnaMessage accountName={accountName} message={message} />
    </div>
  );

DonnaLoading.propTypes = {
  isLoading: PropTypes.bool,
  accountName: PropTypes.string,
  message: PropTypes.string,
};

DonnaLoading.defaultProps = {
  isLoading: false,
  accountName: '',
  message: '',
};

export default DonnaLoading;
