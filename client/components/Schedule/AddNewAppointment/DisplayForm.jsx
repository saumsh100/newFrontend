
import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Form, CardHeader } from '../../library';
import AppointmentForm from './AppointmentForm';
import PatientForm from './PatientForm';
import styles from './styles.scss';


const generateEntityOptions = (entities, label) => {
  const options = [];
  entities.map((entity) => {
    options.push({ label: entity[label], value: entity.id });
  });
  return options;
}


export default function DisplayForm(props) {
  const {
    handleSubmit,
    services,
    chairs,
    practitioners,
    getSuggestions,
  } = props;

  const serviceOptions = generateEntityOptions(services, 'name');
  const practitionerOptions = generateEntityOptions(practitioners, 'firstName');
  const chairOptions = generateEntityOptions(chairs, 'name');

  return (
    <Form
      form="NewAppointmentForm"
      onSubmit={handleSubmit}
      className={styles.formContainer}
    >
      <Grid className={styles.addNewAppt}>
        <Row className={styles.addNewAppt_mainContainer}>
          <Col xs={12} sm={6} md={8}>
            <div className={styles.title}>Create New Appoinment</div>
            <AppointmentForm
              serviceOptions={serviceOptions}
              practitionerOptions={practitionerOptions}
              chairOptions={chairOptions}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <PatientForm
              getSuggestions={getSuggestions}
            />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

DisplayForm.PropTypes = {
  handleSubmit: PropTypes.func,
}
