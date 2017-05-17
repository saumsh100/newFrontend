
import React, { PropTypes } from 'react';
import { change } from 'redux-form';
import { Grid, Row, Col, Field } from '../../library';
import styles from './styles.scss';

const validatePatient = (value) => {
  return (value && (typeof value !== 'object')) ? 'No Patient With That Name' : undefined;
};

const handleAutoSuggest2 = (newValue, formName) => {
  if (typeof newValue === 'object') {
    change(formName, 'patient.phoneNumber', newValue.phoneNumber);
    change(formName, 'patient.email', newValue.email);
  }
};

export default function PatientForm ({ getSuggestions, formName }) {
  return (
    <Grid className={styles.addNewAppt_mainContainer_right}>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <Field
            component="AutoComplete"
            name="patientData"
            label="Enter Patient Name"
            getSuggestions={getSuggestions}
            onChange={(e, newValue) => handleAutoSuggest2(newValue, formName)}
            validate={[validatePatient]}
            required
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <Field
            name="phoneNumber"
            label="Phone #"
            disabled
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} >
          <Field
            name="email"
            label="Email"
            disabled
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} className={styles.addNewAppt_col_textArea} >
          <Field
            component="TextArea"
            name="note"
            label="Comment"
            rows={6}
            className={styles.addNewAppt_comment}
          />
        </Col>
      </Row>
    </Grid>
  );
}

PatientForm.propTypes = {
  getSuggestions: PropTypes.func,
  formName: PropTypes.string,
};


