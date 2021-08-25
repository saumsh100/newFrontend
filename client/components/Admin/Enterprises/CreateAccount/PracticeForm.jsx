import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { Form, Field } from '../../../library';

const requiredValidation = (val) => (val ? undefined : `Practice  name is required`);
function PracticeForm(props) {
  const { onSubmit, index, initialValues, formName } = props;

  const enterprise = props.enterprises.get(props.initialValues.enterpriseId);

  return (
    <Form
      form={formName}
      initialValues={{
        ...initialValues,
        organization: enterprise.organization,
        csmAccountOwnerId: enterprise.csmAccountOwnerId,
      }}
      onSubmit={(data) => onSubmit(index, data)}
      ignoreSaveButton
    >
      <Field autoFocus required name="name" label="Practice name" validate={[requiredValidation]} />
      <Field name="externalId" label="External Id" />
      <Field name="organization" label="Organization" disabled />
      <Field
        label="CSM Account Owner"
        name="csmAccountOwnerId"
        component="SuperAdminPicker"
        disabled
      />
    </Form>
  );
}

function mapStateToProps({ entities }) {
  return {
    enterprises: entities.getIn(['enterprises', 'models']),
  };
}

export default connect(mapStateToProps)(PracticeForm);

PracticeForm.defaultProps = {
  initialValues: {
    name: '',
  },
};

PracticeForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string),
  formName: PropTypes.string.isRequired,
  enterprises: PropTypes.instanceOf(Map).isRequired,
};
