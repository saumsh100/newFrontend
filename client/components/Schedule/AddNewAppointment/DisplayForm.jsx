
import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Form, CardHeader } from '../../library';
import AppointmentForm from './AppointmentForm';
import PatientForm from './PatientForm';
import styles from './styles.scss';


export default function DisplayForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="NewAppointmentForm"
      onSubmit={handleSubmit}

    >
      <Grid className={styles.addNewAppt}>
        <Row className={styles.addNewAppt_grid}>
          <Col xs={12} sm={6} md={7}>
            <div className={styles.title}>Create New Appoinment</div>
            <AppointmentForm />
          </Col>
          <Col xs={12} sm={6} md={5}>
            <PatientForm />
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

DisplayForm.PropTypes = {
  handleSubmit: PropTypes.func,
}
