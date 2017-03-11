import React, {Component, PropTypes } from 'react';
import { Map } from 'immutable';
import {  Form, Field, IconButton } from '../../library';
import styles from './styles.scss';
import OfficeHoursForm from '../Schedule/OfficeHours/OfficeHoursForm';
import BreaksForm from '../Schedule/OfficeHours/BreaksForm';

class PractitionerItemData extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePractitioner = this.updatePractitioner.bind(this);
    this.deletePractitioner = this.deletePractitioner.bind(this);
  }

  handleSubmit(values) {
    console.log(values);
  }

  updatePractitioner(values) {
    const { practitioner } = this.props;
    const valuesMap = Map(values);
    const modifiedPractitioner = practitioner.merge(valuesMap);
    this.props.onSubmit(modifiedPractitioner);
  }

  deletePractitioner() {
    const { practitioner } = this.props;
    this.props.deletePractitioner(practitioner.get('id'));
  }

  render() {
    const { practitioner, weeklySchedule } = this.props;

    if(!practitioner || !weeklySchedule) {
      return null;
    }


    const initialValues = {
      firstName: practitioner.get('firstName'),
      lastName: practitioner.get('lastName'),
    };

    return (
      <div>
        <div className={styles.practFormContainer}>
          <div className={styles.practForm}>
            <Form
              form={`${practitioner.get('id')}Form`}
              onSubmit={this.updatePractitioner}
              initialValues={initialValues}
            >
              <div className={styles.practFormRow}>
                <div className={styles.practFormField}>
                  <Field
                    required
                    name="firstName"
                    label="First Name"
                  />
                </div>
                <div className={styles.practFormField}>
                  <Field
                    required
                    name="lastName"
                    label="Last Name"
                  />
                </div>
              </div>
            </Form>
          </div>
          <div className={styles.trashButton}>
            <IconButton
              icon="trash-o"
              className={styles.trashButton__trashIcon}
              onClick={this.deletePractitioner}
            />
          </div>
        </div>
        <div>
          <OfficeHoursForm
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleSubmit}
            formName="officeHours"
          />
          <BreaksForm
            weeklySchedule={weeklySchedule}
            onSubmit={this.handleSubmit}
            formName="clinicBreaks"
          />
        </div>
      </div>
    );
  }
}

export default PractitionerItemData;
