import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '../../../../library';

const handleForm = (callback) => (values) => {
  callback(values);
};

export default function FilterForm({ children, formName, formValueCallback, initialValues }) {
  return (
    <Form
      form={formName}
      onChange={handleForm(formValueCallback)}
      ignoreSaveButton
      destroyOnUnmount={false}
      data-test-id={formName}
      initialValues={initialValues}
    >
      {children}
    </Form>
  );
}

FilterForm.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  initialValues: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array]))
    .isRequired,
  formName: PropTypes.string.isRequired,
  formValueCallback: PropTypes.func.isRequired,
};
