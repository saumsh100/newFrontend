
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, FormSection } from '../../../../library';
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

function Appointments({ theme: { input, date }, timezone }) {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeaderInput}>First Appointment</div>
      <FormSection name="firstApptDate" className={styles.formContainer_row}>
        <Field component="DayPicker" timezone={timezone} name="0" theme={date} label="Date" />
        <span className={styles.formContainer_middleText}> to </span>
        <Field component="DayPicker" timezone={timezone} name="1" theme={date} label="Date" />
      </FormSection>
      <div className={styles.formHeaderInput}>Last Appointment</div>
      <FormSection name="lastApptDate" className={styles.formContainer_row}>
        <Field component="DayPicker" timezone={timezone} name="0" theme={date} label="Date" />
        <span className={styles.formContainer_middleText}> to </span>
        <Field component="DayPicker" timezone={timezone} name="1" theme={date} label="Date" />
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
          theme={input}
        />
        <span className={styles.formContainer_middleText}> to </span>
        <Field
          name="1"
          type="number"
          validate={[notNegative]}
          normalize={parseNum}
          data-test-id="duration"
          label="Amount"
          theme={input}
        />
      </FormSection>
      <div className={styles.formHeader}>Booked Appointments</div>
      <FormSection name="bookedAppointments" className={styles.formContainer_row}>
        <span className={styles.formContainer_dropDownInput}>
          <Field
            component="DropdownSelect"
            name="0"
            options={mathSymbols}
            className={styles.ddSelect}
            label="> < ="
            theme={input}
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
            theme={input}
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
            theme={input}
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
            theme={input}
            label="Amount"
          />
        </span>
      </FormSection>
    </div>
  );
}

Appointments.propTypes = {
  theme: PropTypes.shape({
    input: PropTypes.objectOf(PropTypes.string),
    date: PropTypes.objectOf(PropTypes.string),
  }),
  timezone: PropTypes.string.isRequired,
};

Appointments.defaultProps = {
  theme: {
    input: {
      group: styles.groupInputStyle2,
      filled: styles.filledLabelStyle,
    },
    date: {
      filled: styles.filledLabelStyle,
      label: styles.dateLabelStyle,
      group: styles.groupInputStyle,
    },
  },
};

const mapStateToProps = ({ auth }) => ({ timezone: auth.get('timezone') });

export default connect(mapStateToProps, null)(Appointments);
