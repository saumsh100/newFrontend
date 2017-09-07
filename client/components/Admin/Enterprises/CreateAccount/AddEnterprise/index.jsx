import React, { PropTypes } from 'react';
import { Form, Field } from '../../../../library';

export default function AddEnterprise(props) {
  const {
    onSubmit,
    index,
    initialValues,
    formName,
  } = props;

  return (
    <Form
      form={formName}
      initialValues={initialValues}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      ignoreSaveButton
    >
      <Field
        required
        name="plan"
        label="Plan"
        component="DropdownSelect"
        options={[
          { value: 'ENTERPRISE' },
          { value: 'GROWTH' },
        ]}
      />
      <Field required name="name" label="Name" />
    </Form>
  );
}

AddEnterprise.propTypes = {
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  index: PropTypes.number,
  formName: PropTypes.string,
};
