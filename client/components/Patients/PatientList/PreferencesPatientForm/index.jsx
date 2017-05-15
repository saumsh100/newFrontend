import React, { PropTypes } from 'react';
import { Form, Field, Button } from '../../../library';


export default function ContactPatientForm({ onSubmit, formName, styles, currentPatient }) {

  const key = currentPatient.id;
  const initialValues = currentPatient.preferences;

  const test = [
    {
      value: 'True',
    },
    {
      value: 'False',
    }
    ,
  ];

  initialValues.newsletter = (initialValues.newsletter === true ? 'True' : 'False');
  initialValues.birthdayMessage = (initialValues.birthdayMessage === true ? 'True' : 'False');

  function submit(values) {
    values.newsletter = values.newsletter === 'True';
    values.birthdayMessage = values.birthdayMessage === 'True';
    onSubmit({ preferences: values });
  }

  return (
    <Form
      key={key}
      form={formName}
      onSubmit={submit}
      className={styles.form}
      initialValues={initialValues}
    >
      <div className={styles.names3}>
        <div className={styles.mailIcon}>
          <i className="fa fa-clock-o" />
        </div>
        <div className={styles.compref}>
          <span className={styles.comprestitle}>Communication Prefereneces</span>
          <div className={styles.morning}>
            <div className={styles.comprestitle}>
              <div className={styles.checkbox}>
                Morning
                <Field
                  className={styles.marginZero}
                  name="morning"
                  component="Checkbox"
                />
              </div>
              <div className={styles.checkbox}>
                Afternoon
                <Field
                  className={styles.marginZero}
                  name="afternoon"
                  component="Checkbox"
                />
              </div>
              <div className={styles.checkbox}>
                Evening
                <Field
                  className={styles.marginZero}
                  name="evening"
                  component="Checkbox"
                />
              </div>
            </div>
            <div className={styles.comprestitle}>
              <div className={styles.checkbox}>
                Weekends
                <Field
                  className={styles.marginZero}
                  name="weekends"
                  component="Checkbox"
                />
              </div>
              <div className={styles.checkbox}>
                Weekdays
                <Field
                  className={styles.marginZero}
                  name="weekdays"
                  component="Checkbox"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.names3}>
        <div className={styles.langaugeIcon}>
          <i className="fa fa-magic" />
        </div>
        <div className={styles.names3}>
          <div className={styles.checkbox}>
            SMS
            <Field
              className={styles.marginZero}
              name="sms"
              component="Checkbox"
            />
          </div>
          <div className={styles.checkbox}>
            Email
            <Field
              className={styles.marginZero}
              name="emailNotifications"
              component="Checkbox"
            />
          </div>
          <div className={styles.checkbox}>
            Phone
            <Field
              className={styles.marginZero}
              name="phone"
              component="Checkbox"
            />
          </div>
        </div>
      </div>

      <div className={styles.names3}>
        <div className={styles.langaugeIcon}>
          <i className="fa fa-bell" />
        </div>
        <div className={styles.toggle}>
          <span>Reminders</span>
          <Field
            name="reminders"
            component="Toggle"
          />
        </div>
      </div>

      <div className={styles.names2}>
        <div className={styles.langaugeIcon}>
          <i className="fa fa-paper-plane" />
        </div>
        <Field
          className={styles.prefInput}
          name="newsletter"
          label="NewsLetter"
          component="DropdownSelect"
          options={test}
        />
      </div>

      <div className={styles.names}>
        <div className={styles.langaugeIcon}>
          <i className="fa fa-calendar" />
        </div>
        <Field
          className={styles.prefInput}
          name="birthdayMessage"
          label="Birthday/Holiday Messages"
          component="DropdownSelect"
          options={test}
        />
      </div>


    </Form>
  );
}

ContactPatientForm.propTypes = {
  formName: PropTypes.string,
  styles: PropTypes.object,
  currentPatient: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
