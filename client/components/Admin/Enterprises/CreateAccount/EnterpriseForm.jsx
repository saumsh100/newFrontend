import PropTypes from 'prop-types';
import React from 'react';
import { Form, Field } from '../../../library';

const requiredValidation = (val) => (val ? undefined : `Enterprise name is required`);

export default function EnterpriseForm(props) {
  const { onSubmit, index, initialValues, formName } = props;

  return (
    <Form
      form={formName}
      initialValues={initialValues}
      onSubmit={(data) => onSubmit(index, data)}
      ignoreSaveButton
    >
      <Field
        autoFocus
        required
        name="name"
        label="Enterprise name"
        validate={[requiredValidation]}
      />
      <Field name="organization" label="Organization" />
      <Field
        label="CSM Account Owner"
        name="csmAccountOwnerId"
        component="SuperAdminPicker"
        search="label"
      />
    </Form>
  );
}

EnterpriseForm.defaultProps = {
  initialValues: {
    name: '',
  },
};

EnterpriseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string),
  formName: PropTypes.string.isRequired,
};
