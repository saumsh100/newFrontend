import React, { PropTypes } from 'react';
import { Form, Field } from '../../../../library';
import Button from "../../../../library/Button/index";

const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength25 = maxLength(50);

export default function ClinicDetails(props) {
  const {
    onSubmit,
    index,
    initialValues,
    formName,
  } = props;

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
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
    </Form>
  );
}

ClinicDetails.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  index: PropTypes.number,
  formName: PropTypes.string,
};
