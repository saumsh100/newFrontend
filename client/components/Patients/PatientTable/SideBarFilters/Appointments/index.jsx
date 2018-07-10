
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, FormSection } from '../../../../library';
import { parseNum, notNegative } from '../../../../library/Form/validate';
import styles from '../styles.scss';

const mathSymbols = [
  {
    label: 'Greater than',
    value: '>=',
  },
  {
    label: 'Less than',
    value: '<=',
  },
  {
    label: 'Equal to',
    value: '=',
  },
];

export default function Appointments(props) {
  const { handleAppointments, theme, dateTheme } = props;

  return (
    <Form
      form="appointments"
      onChange={handleAppointments}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div className={styles.formContainer}>
        <div className={styles.formHeaderInput}>First Appointment</div>
        <FormSection name="firstAppointment" className={styles.formContainer_row}>
          <Field component="DayPicker" name="0" theme={dateTheme} label="Date" />
          <span className={styles.formContainer_middleText}> to </span>
          <Field component="DayPicker" name="1" theme={dateTheme} label="Date" />
        </FormSection>
        <div className={styles.formHeaderInput}>Last Appointment</div>
        <FormSection name="lastAppointment" className={styles.formContainer_row}>
          <Field component="DayPicker" name="0" theme={dateTheme} label="Date" />
          <span className={styles.formContainer_middleText}> to </span>
          <Field component="DayPicker" name="1" theme={dateTheme} label="Date" />
        </FormSection>
        <div className={styles.formHeader}> Production </div>
        <FormSection name="production" className={styles.formContainer_row}>
          <Field
            name="0"
            type="number"
            validate={[notNegative]}
            normalize={parseNum}
            data-test-id="duration"
            label="Amount"
            theme={theme}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            name="1"
            type="number"
            validate={[notNegative]}
            normalize={parseNum}
            data-test-id="duration"
            label="Amount"
            theme={theme}
          />
        </FormSection>
        <div className={styles.formHeader}>Booked Appointments</div>
        <FormSection name="appointmentsCount" className={styles.formContainer_row}>
          <span className={styles.formContainer_dropDownInput}>
            <Field
              component="DropdownSelect"
              name="0"
              options={mathSymbols}
              className={styles.ddSelect}
              label="> < ="
              theme={theme}
            />
          </span>
          <span className={styles.formContainer_numberInput}>
            <Field
              name="1"
              type="number"
              validate={[notNegative]}
              normalize={parseNum}
              data-test-id="duration"
              label="Amount"
              theme={theme}
            />
          </span>
        </FormSection>
        <div className={styles.formHeader}> Online Appointments </div>
        <FormSection name="onlineAppointments" className={styles.formContainer_row}>
          <span className={styles.formContainer_dropDownInput}>
            <Field
              component="DropdownSelect"
              name="0"
              options={mathSymbols}
              className={styles.ddSelect}
              theme={theme}
              label="> < ="
            />
          </span>
          <span className={styles.formContainer_numberInput}>
            <Field
              name="1"
              type="number"
              validate={[notNegative]}
              normalize={parseNum}
              data-test-id="duration"
              theme={theme}
              label="Amount"
            />
          </span>
        </FormSection>
      </div>
    </Form>
  );
}

Appointments.propTypes = {
  handleAppointments: PropTypes.func.isRequired,
  theme: PropTypes.objectOf(PropTypes.string),
  dateTheme: PropTypes.objectOf(PropTypes.string),
};

Appointments.defaultProps = {
  theme: {},
  dateTheme: {},
};
