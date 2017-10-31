
import React, { PropTypes } from 'react';
import { Form, Field } from '../../../../library';
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
        <div className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="firstApp1"
            label="Date"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="firstApp2"
            label="Date"
          />
        </div>
        <div className={styles.formHeaderInput}>Last Appointment</div>
        <div className={styles.formContainer_row} >
          <Field
            required
            component="DayPicker"
            name="lastApp1"
            label="Date"
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            required
            component="DayPicker"
            name="lastApp2"
            label="Date"
          />
        </div>
        <div className={styles.formHeader}>Treatment</div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="treatment"
            options={[{
              label: 'cleaning',
              value: 'cleaning',
            }]}
            className={styles.ddSelect}
            label="Treatment"
          />
        </div>
        <div className={styles.formHeader}>Number of Appointments </div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="app1"
            options={[{
              label: 'Greater than',
              value: '>',
            }]}
          />
          <span className={styles.formContainer_middleText}>
            <Field
              component="DropdownSelect"
              name="app2"
              options={[{
                label: '10',
                value: '10',
              }]}
              label="#"
              className={styles.ddSelect}
            />
          </span>
          <Field
            component="DropdownSelect"
            name="app3"
            options={[{
              label: 'All Time',
              value: 'allTime',
            }]}
            className={styles.ddSelect}
          />
        </div>
        <div className={styles.formHeader}> Production </div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="prod1"
            options={[{
              label: '$0',
              value: '0',
            }]}
          />
          <span className={styles.formContainer_middleText}> to </span>
          <Field
            component="DropdownSelect"
            name="prod2"
            options={[{
              label: '$1000',
              value: '1000',
            }]}
            className={styles.ddSelect}
          />
        </div>
        <div className={styles.formHeader}> Online Appointments </div>
        <div className={styles.formContainer_row} >
          <Field
            component="DropdownSelect"
            name="online1"
            options={[{
              label: 'Greater than',
              value: '>',
            }]}
          />
          <span className={styles.formContainer_middleText}>
            <Field
              component="DropdownSelect"
              name="online2"
              label="#"
              options={[{
                label: '10',
                value: '10',
              }]}
              className={styles.ddSelect}
            />
          </span>
          <Field
            component="DropdownSelect"
            name="online3"
            options={[{
              label: 'All Time',
              value: 'allTime',
            }]}
            className={styles.ddSelect}
          />
        </div>
      </div>
    </Form>
  );
}
