
import React, { PropTypes } from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AvailabilityContainer from './AvailabilityContainer';

import styles from './styles.scss';

function PatientApp(props) {
  debugger;
  return (
    <div>
      <AvailabilityContainer />
    </div>
  );
}

PatientApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {

  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(PatientApp);
