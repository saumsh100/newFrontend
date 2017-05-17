
import React, { PropTypes } from 'react';
import { Grid, Row, Col, Field } from '../../library';
import styles from './styles.scss';

function validatePatient(value) {
  return (value && (typeof value !== 'object')) ? 'No Patient With That Name' : undefined;
}

export default function PatientForm(props) {

  const {
    getSuggestions,
    handleAutoSuggest,
  } = props;

  return (
    <Grid className={styles.addNewAppt_mainContainer_right}>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <Field
            component="AutoComplete"
            name="patientData"
            label="Enter Patient Name"
            getSuggestions={getSuggestions}
            onChange={(e, newValue) => handleAutoSuggest(newValue)}
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

