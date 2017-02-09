import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';
import InsuranceForm from './InsuranceForm';
export default function InsuranceData(props) {
  const { patient, currentPatientState, tabTitle } = props;
  if (!patient) {
    return <div className={styles.loading}>Loading...</div>;
  }
  return (
    <InsuranceForm 
      patient={patient}
      tabTitle={props.tabTitle}
      form={props.form}
      changePatientInfo={props.changePatientInfo}
    />
  ); 
}

