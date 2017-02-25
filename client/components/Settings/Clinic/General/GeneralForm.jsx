
import React from 'react';
import TestForm from '../../../demo/TestForm';
import { Form, Field, Button } from '../../../library';

export default function GeneralForm({ onSubmit }) {
  return (
    <Form form="generalSettings Form" onSubmit={onSubmit}  >
      <Field
        required
        name="Name"
        label="Name"
      />
      <Button type="submit">Form Submit</Button>
    </Form>
  );
}
