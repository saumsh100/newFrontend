
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

const DonnaLoading = ({ donnaLoadingAccount, donnaLoadingText, isLoading }) =>
  isLoading && (
    <div>
      <LoadingBars />
      <DonnaMessage accountName={donnaLoadingAccount} dataLoading={donnaLoadingText} />
    </div>
  );

DonnaLoading.propTypes = {
  isLoading: PropTypes.bool,
  donnaLoadingAccount: PropTypes.string,
  donnaLoadingText: PropTypes.string,
};

DonnaLoading.defaultProps = {
  isLoading: false,
  donnaLoadingAccount: '',
  donnaLoadingText: '',
};

export default DonnaLoading;
