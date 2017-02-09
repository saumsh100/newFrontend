import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';
import { Field as RField } from 'redux-form'
import PersonalForm from './PersonalForm';

class PersonalData extends Component {
  render() {
    const { patient, currentPatientState, tabTitle } = this.props;
    if (!patient) {
      return <div className={styles.loading}>Loading...</div>;
    }
    return <PersonalForm 
      patient={patient}
      tabTitle={this.props.tabTitle}
      form={this.props.form}
      changePatientInfo={this.props.changePatientInfo}
      />
  }
}

export default PersonalData;
