import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { Form, Field } from '../../../../library';

export default function RenameForm(props) {
  const { label, onSubmit, index, initialValues, formName } = props;
  const [labelName] = useState(`${label} name`);
  const requiredValidation = useCallback((val) => (val ? undefined : `${labelName} is required`), [
    labelName,
  ]);

  return (
    <Form
      form={formName}
      initialValues={initialValues}
      onSubmit={(data) => onSubmit(index, data)}
      ignoreSaveButton
    >
      <Field autoFocus required name="name" label={labelName} validate={[requiredValidation]} />
    </Form>
  );
}

RenameForm.defaultProps = {
  initialValues: {
    name: '',
  },
};

RenameForm.propTypes = {
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string),
  formName: PropTypes.string.isRequired,
};
