
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

function validatePatient(value) {
  return (value && (typeof value !== 'object')) ? 'No Patient With That Name' : undefined;
}

const initialValues = {
  preferences: {
    mornings: true,
    afternoons: true,
    evenings: true,
    weekdays: true,
    weekends: true,
  },

  unavailableDays: [],
};

function AddWaitSpotForm({ onSubmit, getSuggestions }) {
  return (
    <Form
      form="addWaitSpot"
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      <Field
        component="AutoComplete"
        name="patientData"
        label="Enter Patient Name"
        getSuggestions={getSuggestions}
        validate={[validatePatient]}
        required
      />
      <div>Preferences</div>
      <FormSection name="preferences">
        <Grid>
          <Row>
            <Col xs={6}>
              <Field
                name="mornings"
                component="Checkbox"
                label="Mornings"
              />
              <br/>
              <Field
                name="afternoons"
                component="Checkbox"
                label="Afternoons"
              />
              <br/>
              <Field
                name="evenings"
                component="Checkbox"
                label="Evenings"
              />
            </Col>
            <Col xs={6}>
              <Field
                name="weekdays"
                component="Checkbox"
                label="Weekdays"
              />
              <br/>
              <Field
                name="weekends"
                component="Checkbox"
                label="Weekends"
              />
            </Col>
          </Row>
        </Grid>
      </FormSection>
      <div>Select Unavailable Days</div>
      <Field
        multiple
        name="unavailableDays"
        target="icon"
        component="DayPicker"
      />
    </Form>
  );
}

AddWaitSpotForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
};

export default AddWaitSpotForm;
