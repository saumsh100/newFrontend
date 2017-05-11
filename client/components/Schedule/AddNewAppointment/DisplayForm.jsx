
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
    patients,
    practitioners,
  } = props;


  const serviceOptions = generateEntityOptions(services, 'name');
  const practititionerOptions = generateEntityOptions(practitioners, 'firstName');
  const chairOptions = generateEntityOptions(chairs, 'name');
  const patientOptions = generateEntityOptions(patients, 'firstName');

  return (
    <Form
      form="NewAppointmentForm"
      onSubmit={handleSubmit}
    >
      <Grid className={styles.addNewAppt}>
        <Row className={styles.addNewAppt_mainContainer}>
          <Col xs={12} sm={6} md={8}>
            <div className={styles.title}>Create New Appoinment</div>
            <AppointmentForm
              serviceOptions={serviceOptions}
              practitionerOptions={practititionerOptions}
              chairOptions={chairOptions}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <PatientForm
              patientOptions={patientOptions}
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
