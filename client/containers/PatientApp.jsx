
import React, { PropTypes } from 'react';
import AvailabilityContainer from '../components/Availabilities';

// We will add a lot more to this in future when Patient site is built out more
function PatientApp() {
  return <AvailabilityContainer />;
}

PatientApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default PatientApp;
