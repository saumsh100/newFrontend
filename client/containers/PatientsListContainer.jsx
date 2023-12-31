
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Patients from '../components/Patients/PatientTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PatientsListContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Patients />;
  }
}

PatientsListContainer.propTypes = {};

function mapStateToProps({ entities }) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(PatientsListContainer);
