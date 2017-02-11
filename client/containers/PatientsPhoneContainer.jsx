
import React, { PropTypes, Component } from 'react';
import PatientsPhone from '../components/Patients/Phone';

class PatientsPhoneContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // TODO: fetchEntities for recent calls
  }

  render() {
    return (
      <PatientsPhone />
    );
  }
}

PatientsPhoneContainer.propTypes = {};

export default PatientsPhoneContainer;
