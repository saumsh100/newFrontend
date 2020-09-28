
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../library';
import styles from './styles.scss';

const getPatientName = (patient, displayNameOption) => {
  if (displayNameOption === 'prefName') {
    return patient.displayName || patient.firstName;
  }
  return patient.firstName;
};

const getMessageFromTemplate = (template, patient, displayNameOption) => {
  const regEx = new RegExp('\\$\\{displayName\\}', 'g');
  const patientName = getPatientName(patient, displayNameOption);
  return template.replace(regEx, patientName);
};

export default function NotifyPatientForm({
  waitingRoomPatient,
  displayNameOption,
  defaultTemplate,
  formName,
  onSubmit,
}) {
  const message = getMessageFromTemplate(
    defaultTemplate,
    waitingRoomPatient.patient,
    displayNameOption,
  );

  const initialValues = { message };

  return (
    <Form
      key={formName}
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id={formName}
      destroyOnUnmount
      ignoreSaveButton
    >
      <div className={styles.heading}>Make any final changes to the text before you send</div>
      <Field
        required
        name="message"
        label="Message"
        data-test-id="message"
        component="TextArea"
        classStyles={styles.messageContainer}
        className={styles.messageTextArea}
      />
    </Form>
  );
}

NotifyPatientForm.propTypes = {
  displayNameOption: PropTypes.oneOf(['firstName', 'prefName']).isRequired,
  waitingRoomPatient: PropTypes.shape({}).isRequired,
  defaultTemplate: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
};
