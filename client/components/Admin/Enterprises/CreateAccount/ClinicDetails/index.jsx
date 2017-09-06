import React, { PropTypes } from 'react';
import { Form, Field } from '../../../../library';
import Button from "../../../../library/Button/index";

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(50);

export default function ClinicDetails({ onSubmit, index, initialValues }) {
  return (
    <Form
      form="clinicDetails"
      onSubmit={(values) => {
        onSubmit(values, index);
      }}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <div>
        <Field
          name="name"
          label="Name"
          validate={[maxLength25]}
        />
      </div>
      <div>
        <Field
          name="website"
          label="Website"
        />
      </div>
      <Button
        type="submit"
      >
        next
      </Button>
    </Form>
  );
}

ClinicDetails.propTypes = {
  onSubmit: PropTypes.func,
};
