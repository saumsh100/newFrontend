
import React from 'react';
import TestForm from '../../../demo/TestForm';
import { Form, Field, Button } from '../../../library';

export default function GeneralForm({onSubmit, accountInfo, }) {

  return (
    <Form form="generalSettingsForm" onSubmit={onSubmit} >
      <Field
        required
        name="Name"
        label={accountInfo.get('name')}
      />
      <Button type="submit">Form Submit</Button>
    </Form>
  );
}
