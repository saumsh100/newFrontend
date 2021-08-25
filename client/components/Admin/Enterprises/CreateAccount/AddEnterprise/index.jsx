import PropTypes from 'prop-types';
import React from 'react';
import { Form, Field } from '../../../../library';
import styles from '../styles.scss';

const options = [{ value: 'ENTERPRISE' }, { value: 'GROWTH' }];

export default function AddEnterprise(props) {
  const { onSubmit, index, initialValues, formName } = props;

  return (
    <Form
      form={formName}
      initialValues={initialValues}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div className={styles.dropDownEnterprise}>
        <Field required name="plan" label="Plan" component="DropdownSelect" options={options} />
      </div>
      <Field required name="name" label="Name" />
      <Field required name="organization" label="Organization" />
      <Field
        label="CSM Account Owner"
        name="csmAccountOwnerId"
        component="SuperAdminPicker"
        search="label"
      />
    </Form>
  );
}

AddEnterprise.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
  formName: PropTypes.string.isRequired,
};
