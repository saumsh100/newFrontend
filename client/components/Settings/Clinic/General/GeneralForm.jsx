
import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';

export default function GeneralForm({ onSubmit, accountInfo }) {
  const initialValues = {
    name: accountInfo.get('name'),
  };

  return (
    <Form form="generalSettingsForm" onSubmit={onSubmit} initialValues={initialValues}>
      <Field
        required
        name="name"
        label="Name"
      />
      <Button type="submit" >Form Submit</Button>
    </Form>
  );
}

GeneralForm.propTypes = {
  onSubmit: PropTypes.func,
  accountInfo: PropTypes.props,
}