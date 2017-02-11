import React, { PropTypes } from 'react';
import TestForm  from '../components/demo/TestForm';

const uuid = require('uuid').v4;
const accountId = uuid();
const justinPatientId = uuid();

class TestFormContainer extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      patient: {
        firstName: 'Justin',
        lastName: 'Sharp',
        phoneNumber: '+17808508886',
        id: justinPatientId,
        accountId,
        birthday: moment({year: 1993, month: 6, day: 15})._d,
        gender: 'male',
        language: 'English',
        insurance: {
          insurance: 'insurance',
          memberId: 'dFSDfWR@R3rfsdFSDFSER@WE',
          contract: '4234rerwefsdfsd',
          carrier: 'sadasadsadsads',
          sin: 'dsasdasdasdadsasad'
        }
      }
    }
  }

  render(){
    return(
      <div>
        <TestForm patient={this.state.patient} onSubmit={values => alert(JSON.stringify(values))} />
      </div>
    );
  }
}

TestFormContainer.propTypes = {
  patient: PropTypes.object.isRequired,
};


export default TestFormContainer;