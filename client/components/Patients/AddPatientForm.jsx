
import React, { PropTypes, Component } from 'react';
import { Form, Field, Button } from '../library';

export default function AddPatientForm({ onSubmit }) {
  return (
    <Form form="addNewPatient" onSubmit={onSubmit}>
      <Field required type="text" name="firstName" label="First Name" />
      <Field required type="text" name="lastName" label="Last Name" />
      <Field
        required
        type="text"
        name="mobilePhoneNumber"
        label="Phone Number"
      />
      <Button type="submit">Add Patient</Button>
    </Form>
  );
}

AddPatientForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
