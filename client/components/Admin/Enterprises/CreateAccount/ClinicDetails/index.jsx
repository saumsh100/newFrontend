
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, getTimezoneList } from '../../../../library';
import styles from '../styles.scss';

export default function ClinicDetails(props) {
  const { onSubmit, index, initialValues, formName } = props;

  const options = getTimezoneList();

  return (
    <Form
      form={formName}
      onSubmit={(values) => {
        onSubmit(values, index, formName);
      }}
      initialValues={initialValues}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div className={styles.clinicDetailsContainer}>
        <div>
          <Field name="name" label="Name" required />
        </div>
        <div>
          <Field name="website" label="Website" type="url" required />
        </div>
        <div className={styles.selectPadding}>
          <Field
            name="timezone"
            label="Timezone"
            component="DropdownSelect"
            options={options}
            required
          />
        </div>
        <div>
          <Field
            name="destinationPhoneNumber"
            label="Destination Phone Number"
            type="tel"
            required
          />
        </div>
      </div>
    </Form>
  );
}

ClinicDetails.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.string),
  index: PropTypes.number.isRequired,
  formName: PropTypes.string.isRequired,
};

ClinicDetails.defaultProps = {
  initialValues: {},
};
