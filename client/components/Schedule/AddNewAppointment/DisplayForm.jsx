
import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Form, FormSection } from '../../library';
import AppointmentForm from './AppointmentForm';
import PatientForm from './PatientForm';
import styles from './styles.scss';

const generateEntityOptions = (entities, label) => {
  const options = [];
  entities.map((entity) => {
    options.push({ label: entity[label], value: entity.id });
  });
  return options;
};

export default function DisplayForm(props) {
  const {
    formName,
    services,
    chairs,
    practitioners,
    getSuggestions,
    selectedAppointment,
    handleSubmit,
    handleAutoSuggest,
    handlePractitionerChange,
  } = props;

  const serviceOptions = generateEntityOptions(services, 'name');
  const practitionerOptions = generateEntityOptions(practitioners, 'firstName');
  const chairOptions = generateEntityOptions(chairs, 'name');
  const title = selectedAppointment ? 'Edit Appointment' : 'Create New Appointment';

  return (
    <Form
      form={formName}
      onSubmit={handleSubmit}
      ignoreSaveButton
      initialValues={selectedAppointment}
    >
      <Grid className={styles.addNewAppt}>
        <Row className={styles.addNewAppt_mainContainer}>
          <Col xs={8} sm={8} md={8}>
            <div className={styles.title}>{title}</div>
            <FormSection name="appointment">
              <AppointmentForm
                serviceOptions={serviceOptions}
                practitionerOptions={practitionerOptions}
                chairOptions={chairOptions}
                handlePractitionerChange={handlePractitionerChange}
              />
            </FormSection>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <FormSection name="patient">
              <PatientForm
                getSuggestions={getSuggestions}
                handleSubmit={handleSubmit}
                handleAutoSuggest={handleAutoSuggest}
              />
            </FormSection>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

DisplayForm.PropTypes = {
  handleSubmit: PropTypes.func,
};
