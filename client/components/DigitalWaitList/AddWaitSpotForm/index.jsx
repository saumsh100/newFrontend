
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  Form,
  FormSection,
  Field,
  Grid,
  Row,
  Col,
} from '../../library';
import styles from './styles.scss';

function validatePatient(value) {
  return (value && (typeof value !== 'object')) ? 'No Patient With That Name' : undefined;
}



function AddWaitSpotForm({ onSubmit, getSuggestions, formName, selectedWaitSpot, patients, }) {
  let initialValues = {
    preferences: {
      mornings: true,
      afternoons: true,
      evenings: true,
      weekdays: true,
      weekends: true,
    },

    unavailableDays: [],
  };

  if (selectedWaitSpot) {
    initialValues = selectedWaitSpot;
    const patient = patients.getIn(['models', selectedWaitSpot.patientId]).toJS();
    initialValues.patientData = patient;
  }

  return (
    <Form
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Field
        component="AutoComplete"
        name="patientData"
        label="Enter Patient Name"
        getSuggestions={getSuggestions}
        validate={[validatePatient]}
        required
      />
      <Grid>
        <Row>
          <Col xs={12} md={6}>
            <Row>
              <Col xs={12}>
                <div className={styles.label}>
                  Preferences
                </div>
              </Col>
            </Row>
            <FormSection name="preferences">
              <Row>
                <Col xs={12} md={6}>
                  <Field
                    name="mornings"
                    component="Checkbox"
                    label="Mornings"
                  />
                  <Field
                    name="afternoons"
                    component="Checkbox"
                    label="Afternoons"
                  />
                  <Field
                    name="evenings"
                    component="Checkbox"
                    label="Evenings"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Field
                    name="weekdays"
                    component="Checkbox"
                    label="Weekdays"
                  />
                  <Field
                    name="weekends"
                    component="Checkbox"
                    label="Weekends"
                  />
                </Col>
              </Row>
            </FormSection>
          </Col>
          <Col xs={12} md={6}>
            <Row>
              <Col xs={12}>
                <div className={styles.label}>
                  Select Unavailable Days
                  <Field
                    multiple
                    name="unavailableDays"
                    target="icon"
                    component="DayPicker"
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

AddWaitSpotForm.propTypes = {
  formName: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  selectedWaitSpot: PropTypes.object,
};

export default AddWaitSpotForm;
