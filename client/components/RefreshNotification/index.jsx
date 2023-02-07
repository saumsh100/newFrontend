import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import RefreshNotificationView from './RefreshNotification.view';

const APP_VERSION_KEY = '@carecru/app-version';
const storedVersion = localStorage.getItem(APP_VERSION_KEY);

function RefreshNotification({ appVersion }) {
  const [showNotification, setShowNotification] = useState(false);

  const handleClose = () => {
    localStorage.setItem(APP_VERSION_KEY, appVersion);
    setShowNotification(false);
  };

  const handleHardReload = () => {
    localStorage.setItem(APP_VERSION_KEY, appVersion);
    window.location.reload(true);
  };

  useEffect(() => {
    if (typeof appVersion === 'string' && storedVersion !== appVersion) {
      setShowNotification(true);
    }
  }, [appVersion]);

  if (storedVersion === appVersion || !showNotification) return null;

  return <RefreshNotificationView handleHardReload={handleHardReload} handleClose={handleClose} />;
}

RefreshNotification.propTypes = {
  appVersion: PropTypes.string.isRequired,
};

function mapStateToProps({ featureFlags }) {
  const appVersion = isFeatureEnabledSelector(featureFlags.get('flags'), 'app-version');
  return { appVersion };
}

export default connect(mapStateToProps)(RefreshNotification);
