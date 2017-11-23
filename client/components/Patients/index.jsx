
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PatientList from './PatientList';
import PatientTable from './PatientTable';


class Patients extends Component {

  render() {

    return (
      <PatientTable
      />
    );
  }
}

Patients.PropTypes = {
};

function mapStateToProps({ entities }) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Patients);

