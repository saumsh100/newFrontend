import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../library';
import styles from './styles.scss';

function RefreshNotificationView({ handleHardReload, handleClose }) {
  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notificationRefreshImg}>
        <img src="/images/refresh.svg" alt="Refresh" />
      </div>
      <div className={styles.notificationContent}>
        <header className={styles.notificationHeader}>
          <p className={styles.title}>CareCru has been upgraded.</p>
          <button type="button" className={styles.closeButton} onClick={handleClose}>
            <Icon icon="times" />
          </button>
        </header>
        <p className={styles.textBody}>
          Refresh to ensure all of the latest <br />
          features and improvements are <br />
          integrated
        </p>
        <footer>
          <button type="button" className={styles.notificationFooter} onClick={handleHardReload}>
            Refresh Page
          </button>
        </footer>
      </div>
    </div>
  );
}

RefreshNotificationView.propTypes = {
  handleHardReload: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default RefreshNotificationView;
