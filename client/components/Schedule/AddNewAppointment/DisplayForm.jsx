
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
    handleSubmit,
    services,
    chairs,
    practitioners,
    getSuggestions,
    formName,
    selectedAppointment,
  } = props;

  const serviceOptions = generateEntityOptions(services, 'name');
  const practitionerOptions = generateEntityOptions(practitioners, 'firstName');
  const chairOptions = generateEntityOptions(chairs, 'name');

  return (
    <Form
      form={formName}
      onSubmit={handleSubmit}
      ignoreSaveButton
      initialValues={selectedAppointment}
    >
      <Grid className={styles.addNewAppt}>
        <Row className={styles.addNewAppt_mainContainer}>
          <Col xs={12} sm={6} md={8}>
            <div className={styles.title}>Create New Appoinment</div>
            <FormSection name="appointment">
              <AppointmentForm
                serviceOptions={serviceOptions}
                practitionerOptions={practitionerOptions}
                chairOptions={chairOptions}
              />
            </FormSection>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <FormSection name="patient">
              <PatientForm
                getSuggestions={getSuggestions}
                handleSubmit={handleSubmit}
                formName={formName}
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
