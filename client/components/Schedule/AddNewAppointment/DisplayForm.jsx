
import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Form } from '../../library';
import AppointmentForm from './AppointmentForm';

export default function DisplayForm(props) {
  const {
    handleSubmit,
  } = props;

  return (
    <Form
      form="NewAppointmentForm"
      onSubmit={handleSubmit}
    >
      <Grid>
        <Row>
          <Col xs={12} sm={6} md={8}>
            <AppointmentForm />
          </Col>
          <Col xs={12} sm={6} md={4}>
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
