import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';
import { Field as RField } from 'redux-form'
import PersonalForm from './PersonalForm';
import InsuranceForm from './InsuranceForm';

export default function PatientData(props) {
  const { patient, currentPatientState, tabTitle } = props;
  if (!patient) {
    return <div className={styles.loading}>Loading...</div>;
  }
  let Content = PersonalForm;
  switch (tabTitle) {
    case 'personal':
      Content = PersonalForm;
    break;
    case 'insurance':
      Content = InsuranceForm;
    break;

  }
  return (
    <Content 
      patient={patient}
      tabTitle={props.tabTitle}
      form={props.form}
      changePatientInfo={props.changePatientInfo}
    />
  ); 
}
