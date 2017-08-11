
import React, { PropTypes, Component } from 'react';
import { fetchEntities } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Phone from '../components/Patients/Phone/';

class PatientsPhoneContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: fetchEntities for recent calls
  }

  render() {
    return (
      <Phone />
    );
  }
}

PatientsPhoneContainer.propTypes = {};

function mapStateToProps({ entities }) {

  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}
const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientsPhoneContainer);
