
import React, { PropTypes } from 'react';
import moment from 'moment-timezone';
import { Form, Field } from '../../../../library';
import styles from '../styles.scss';

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

  const options = moment.tz.names().map((value) => {
    const exp = new RegExp(/america/i);
    if (exp.test(value)) {
      return {
        value,
      };
    }
    return {
      value: null,
    };
  }).filter(filterValue => filterValue.value !== null);

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
      <div >
        <Field
          name="destinationPhoneNumber"
          label="Destination Phone Number"
          type="tel"
        />
      </div>
      <div className={styles.selectPadding}>
        <Field
          name="timezone"
          label="Timezone"
          component="DropdownSelect"
          options={options}
          data-test-id="timezone"
          search
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
