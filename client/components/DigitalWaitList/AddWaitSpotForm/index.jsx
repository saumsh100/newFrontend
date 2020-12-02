
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Form, FormSection, Field, Grid, Row, Col, Header } from '../../library';
import styles from './styles.scss';

function validatePatient(value) {
  return value && typeof value !== 'object' ? 'No Patient With That Name' : undefined;
}

function AddWaitSpotForm({
  onSubmit,
  getSuggestions,
  formName,
  selectedWaitSpot,
  timezone,
  patientUsers,
  patients,
}) {
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

  let displayField = (
    <Field
      component="AutoComplete"
      name="patientData"
      label="Enter Patient Name"
      getSuggestions={getSuggestions}
      validate={[validatePatient]}
      disable
      required
    />
  );

  // Dealing with patientId and patientUserId
  if (selectedWaitSpot) {
    // If unavailabledays is set to null then set it to an empty array otherwise
    // the daypicker throws an error.
    if (selectedWaitSpot.unavailableDays === null) {
      initialValues = selectedWaitSpot;
      initialValues.unavailableDays = [];
    } else {
      initialValues = selectedWaitSpot;
    }

    if (!selectedWaitSpot.patientId && selectedWaitSpot.patientUserId) {
      const patientUser = patientUsers.getIn(['models', selectedWaitSpot.patientUserId]);
      displayField = <Header title={patientUser.getFullName()} />;
    } else if (selectedWaitSpot.patientId) {
      const patient = patients.getIn(['models', selectedWaitSpot.patientId]);
      initialValues.patientData = patient.toJS();
      displayField = <Header title={patient.getFullName()} />;
    }
  }

  return (
    <Form form={formName} onSubmit={onSubmit} initialValues={initialValues} ignoreSaveButton>
      {displayField}
      <Grid>
        <Row>
          <Col xs={12} md={6}>
            <Row>
              <Col xs={12}>
                <div className={styles.label}>Preferences</div>
              </Col>
            </Row>
            <FormSection name="preferences">
              <Row>
                <Col xs={12} md={6}>
                  <Field name="mornings" component="Checkbox" label="Mornings" />
                  <Field name="afternoons" component="Checkbox" label="Afternoons" />
                  <Field name="evenings" component="Checkbox" label="Evenings" />
                </Col>
                <Col xs={12} md={6}>
                  <Field name="weekdays" component="Checkbox" label="Weekdays" />
                  <Field name="weekends" component="Checkbox" label="Weekends" />
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
                    timezone={timezone}
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
  selectedWaitSpot: PropTypes.objectOf(PropTypes.any),
  timezone: PropTypes.string.isRequired,
  patientUsers: PropTypes.objectOf(PropTypes.any),
  patients: PropTypes.objectOf(PropTypes.any),
};

AddWaitSpotForm.defaultProps = {
  formName: null,
  selectedWaitSpot: null,
  patientUsers: null,
  patients: null,
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(
  mapStateToProps,
  null,
)(AddWaitSpotForm);
