
import React from 'react';
import { Button, Form, FormSection, Field } from '../../../library';

function submit(values) {
  alert(JSON.stringify(values));
}

export default function OfficeHoursForm() {
  const initialValues = {
    monday: { isClosed: false },
  };

  const DayHoursForm = (
    <div>
      {'Monday'}
      <Field component="Toggle" name="isClosed" />
    </div>
  );

  return (
    <Form form="officeHours" onSubmit={submit} initialValues={initialValues}>
      <FormSection name="monday">
        {DayHoursForm}
      </FormSection>
      <Button type="submit" label="Submit me!" />
    </Form>
  );
}
