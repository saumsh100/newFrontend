
import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles.scss';

/**
 * This component provides the structure for our static patient pages
 * ex.// Unsubscribe page, Confirmed Appointment page, Confirmed Email page, Reset-Password
 */
class PatientPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div className={styles.patientPage}>
        {children}
      </div>
    );
  }
}

PatientPage.propTypes = {
  children: PropTypes.node,
};

function mapStateToProps({  }) {
  return {

  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(PatientPage);
