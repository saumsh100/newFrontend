
import React, { PropTypes } from 'react';
import { Form, Field, FormSection } from '../../../../library';
import styles from '../styles.scss';

export default function Appointments(props) {
  const {
    handleAppointments,
  } = props;

  return (
    <Form
      form="appointments"
      onChange={handleAppointments}
      ignoreSaveButton
    >
      <div className={styles.formContainer}>
        <div className={styles.formHeaderInput}>First Appointment</div>
        <FormSection name="firstAppointment" className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formHeaderInput}>Last Appointment</div>
        <FormSection name="lastAppointment" className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="0"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="1"
          />
        </FormSection>
        <div className={styles.formHeader}>Number of Appointments </div>
        <FormSection name="appointmentsCount" className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="0"
            options={[{
              label: 'Greater than',
              value: '>',
            }]}
          />
          <span className={styles.formContainer_middleText}>
            <Field
              component="DropdownSelect"
              name="1"
              options={[{
                label: '10',
                value: '10',
              }]}
              className={styles.ddSelect}
            />
          </span>
          <Field
            component="DropdownSelect"
            name="2"
            options={[{
              label: 'All Time',
              value: 'allTime',
            }]}
            className={styles.ddSelect}
          />
        </FormSection>
        <div className={styles.formHeader}> Production </div>
        <FormSection name="production" className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="0"
            options={[{
              label: '$0',
              value: '0',
            }]}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DropdownSelect"
            name="1"
            options={[{
              label: '$1000',
              value: '1000',
            }]}
            className={styles.ddSelect}
          />
        </FormSection>
        <div className={styles.formHeader}> Online Appointments </div>
        <FormSection name="onlineAppointments" className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="0"
            options={[{
              label: 'Greater than',
              value: '>',
            }]}
          />
          <span className={styles.formContainer_middleText}>
            <Field
              component="DropdownSelect"
              name="1"
              options={[{
                label: '10',
                value: '10',
              }]}
              className={styles.ddSelect}
            />
          </span>
          <Field
            component="DropdownSelect"
            name="2"
            options={[{
              label: 'All Time',
              value: 'allTime',
            }]}
            className={styles.ddSelect}
          />
        </FormSection>
      </div>
    </Form>
  );
}
