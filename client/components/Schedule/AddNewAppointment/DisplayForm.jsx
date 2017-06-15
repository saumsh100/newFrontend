
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Grid, Row, Col, Form, FormSection } from '../../library';
import AppointmentForm from './AppointmentForm';
import PatientForm from './PatientForm';
import { setTime } from '../../library/util/TimeOptions';
import styles from './styles.scss';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

const generateEntityOptions = (entities, label) => {
  const options = [];
  entities.map((entity) => {
    options.push({ label: entity[label], value: entity.id });
  });
  return options;
};

export default function DisplayForm(props) {
  const {
    formName,
    patients,
    services,
    chairs,
    practitioners,
    getSuggestions,
    selectedAppointment,
    handleSubmit,
    handleAutoSuggest,
    handlePractitionerChange,
  } = props;

  let initialValues = null;

  if (selectedAppointment) {
    const {
      startDate,
      endDate,
      customBufferTime,
      patientId,
      serviceId,
      chairId,
      practitionerId,
      note,
      isPatientConfirmed,
      isCancelled,
    } = selectedAppointment;

    const patient = patients.get(patientId);
    const durationTime = getDuration(startDate, endDate, customBufferTime);
    const bufferTime = customBufferTime ? durationTime + customBufferTime : durationTime;

    initialValues = {
      appointment: {
        time: setTime(startDate),
        date: moment(startDate).format('L'),
        serviceId,
        practitionerId: practitionerId || '',
        chairId: chairId || '',
        duration: [durationTime, bufferTime],
        isPatientConfirmed,
        isCancelled,
      },
      patient: {
        patientSelected: patient.toJS(),
        mobilePhoneNumber: patient.get('mobilePhoneNumber') || patient.get('homePhoneNumber'),
        email: patient.get('email'),
        note,
      },
    };
  }

  const serviceOptions = generateEntityOptions(services, 'name');
  const practitionerOptions = generateEntityOptions(practitioners, 'firstName');
  const chairOptions = generateEntityOptions(chairs, 'name');
  const title = selectedAppointment && !selectedAppointment.request ? 'Edit Appointment' : 'Create New Appointment';

  return (
    <Form
      form={formName}
      onSubmit={handleSubmit}
      ignoreSaveButton
      initialValues={initialValues}
    >
      <Grid className={styles.addNewAppt}>
        <Row className={styles.addNewAppt_mainContainer}>
          <Col xs={8} sm={8} md={8}>
            <div className={styles.title}>{title}</div>
            <FormSection name="appointment">
              <AppointmentForm
                serviceOptions={serviceOptions}
                practitionerOptions={practitionerOptions}
                chairOptions={chairOptions}
                handlePractitionerChange={handlePractitionerChange}
                selectedAppointment={selectedAppointment}
              />
            </FormSection>
          </Col>
          <Col xs={4} sm={4} md={4}>
            <FormSection name="patient">
              <PatientForm
                getSuggestions={getSuggestions}
                handleSubmit={handleSubmit}
                handleAutoSuggest={handleAutoSuggest}
              />
            </FormSection>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
}

DisplayForm.PropTypes = {
  handleSubmit: PropTypes.func,
};
