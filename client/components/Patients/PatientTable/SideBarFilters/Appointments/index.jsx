
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field, FormSection } from '../../../../library';
import { parseNum, notNegative } from '../../../../library/Form/validate';
import styles from '../styles.scss';


export default function Appointments(props) {
  const {
    handleAppointments,
    theme,
  } = props;

  return (
    <Form
      form="appointments"
      onChange={handleAppointments}
      ignoreSaveButton
      destroyOnUnmount={false}
    >
      <div className={styles.formContainer}>
        <div className={styles.formHeaderInput}>First Appointment</div>
        <FormSection name="firstAppointment" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
            theme={theme}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
            theme={theme}
          />
        </FormSection>
        <div className={styles.formHeaderInput}>Last Appointment</div>
        <FormSection name="lastAppointment" className={styles.formContainer_row} >
          <Field
            component="DayPicker"
            name="0"
            theme={theme}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DayPicker"
            name="1"
            theme={theme}
          />
        </FormSection>
        <div className={styles.formHeader}> Production </div>
        <FormSection name="production" className={styles.formContainer_row} >
          <Field
            name="0"
            type="number"
            validate={[notNegative]}
            normalize={parseNum}
            data-test-id="duration"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            name="1"
            type="number"
            validate={[notNegative]}
            normalize={parseNum}
            data-test-id="duration"
          />
        </FormSection>
        <div className={styles.formHeader}>Number of Appointments </div>
        <FormSection name="appointmentsCount" className={styles.formContainer_row} >
          <span className={styles.formContainer_dropDownInput}>
            <Field
              component="DropdownSelect"
              name="0"
              options={[{
                label: 'Greater Than',
                value: '>=',
              },{
                label: 'Less Than',
                value: '<=',
              }, {
                label: 'Equal To',
                value: '=',
              }]}
              className={styles.ddSelect}
            />
          </span>
          <span className={styles.formContainer_numberInput}>
           <Field
             name="1"
             type="number"
             validate={[notNegative]}
             normalize={parseNum}
             data-test-id="duration"
           />
          </span>
        </FormSection>
        <div className={styles.formHeader}> Online Appointments </div>
        <FormSection name="onlineAppointments" className={styles.formContainer_row} >
          <span className={styles.formContainer_dropDownInput}>
            <Field
              component="DropdownSelect"
              name="0"
              options={[{
                label: 'Greater Than',
                value: '>=',
              },{
                label: 'Less Than',
                value: '<=',
              }, {
                label: 'Equal To',
                value: '=',
              }]}
              className={styles.ddSelect}
            />
          </span>
          <span className={styles.formContainer_numberInput}>
            <Field
              name="1"
              type="number"
              validate={[notNegative]}
              normalize={parseNum}
              data-test-id="duration"
            />
          </span>
        </FormSection>
      </div>
    </Form>
  );
}

Appointments.propTypes = {
  handleAppointments: PropTypes.func.isRequired,
};
