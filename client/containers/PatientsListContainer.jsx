
import React, { PropTypes, Component } from 'react';
import Patients from '../components/Patients/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const HOW_MANY_TO_SKIP = 10;

class PatientsListContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Patients />
    );
  }
}

PatientsListContainer.PropTypes = {
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

export default enhance(PatientsListContainer);
