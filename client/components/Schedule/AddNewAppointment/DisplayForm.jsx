
import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Form, CardHeader } from '../../library';
import AppointmentForm from './AppointmentForm';
import styles from './styles.scss';


export default function DisplayForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="NewAppointmentForm"
      onSubmit={handleSubmit}
      className={styles.addNewAppt}
    >
      <Grid className={styles.addNewAppt_grid}>
        <Row>
          <Col xs={12} sm={6} md={7}>
            <AppointmentForm />
          </Col>
          <Col xs={12} sm={6} md={5}>
            test
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

DisplayForm.PropTypes = {
  handleSubmit: PropTypes.func,
}
