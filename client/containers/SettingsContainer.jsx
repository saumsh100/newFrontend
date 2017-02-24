
import React, { PropTypes } from 'react';
import Settings from '../components/Settings';

// TODO: fetch current Settings and user (should already be in Redux)
function SettingsContainer(props) {
  return <Settings {...props} />;
}

SettingsContainer.propTypes = {};

export default SettingsContainer;
