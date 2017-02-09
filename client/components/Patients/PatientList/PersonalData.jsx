import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';
import { Button, Form, Field } from '../../library';
import { Field as RField } from 'redux-form'
import PersonalForm from './PersonalForm';

export default function PersonalData(props) {
  const { patient, currentPatientState, tabTitle } = props;
  if (!patient) {
    return <div className={styles.loading}>Loading...</div>;
  }
  return (
    <PersonalForm 
      patient={patient}
      tabTitle={props.tabTitle}
      form={props.form}
      changePatientInfo={props.changePatientInfo}
    />
  ); 
}
