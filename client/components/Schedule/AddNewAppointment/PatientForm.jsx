
import React, { PropTypes } from 'react';
import DisplaySearchedPatient from './DisplaySearchedPatient';
import { Grid, Row, Col, Field } from '../../library';
import styles from './styles.scss';

function validatePatient(value) {
  return (value && (typeof value !== 'object')) ? 'Searching...' : undefined;
}

export default function PatientForm(props) {
  const {
    getSuggestions,
    handleAutoSuggest,
    patientSearched,
  } = props;

  return (
    <Grid className={styles.addNewAppt_mainContainer_right}>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12}>
          <DisplaySearchedPatient
            patientSearched={patientSearched}
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_rowSuggest}>
        <Col xs={12} data-test-id="patientSelected">
          <Field
            component="AutoComplete"
            name="patientSelected"
            label="Patient Search"
            getSuggestions={getSuggestions}
            onChange={(e, newValue) => handleAutoSuggest(newValue)}
            validate={[validatePatient]}
            required
          />
        </Col>
      </Row>
      <Row className={styles.addNewAppt_mainContainer_right_row}>
        <Col xs={12} className={styles.addNewAppt_col_textArea} >
          <div className={styles.addNewAppt_comment_label}>Comment</div>
          <Field
            component="TextArea"
            name="note"
            rows={9}
            className={styles.addNewAppt_comment}
            data-test-id="note"
          />
        </Col>
      </Row>
    </Grid>
  );
}

