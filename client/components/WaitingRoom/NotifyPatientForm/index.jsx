
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../library';
import styles from './styles.scss';

export default function NotifyPatientForm({
  waitingRoomPatient,
  defaultTemplate,
  formName,
  onSubmit,
}) {
  const regex = new RegExp('\\$\\{firstName\\}', 'g');
  const message = defaultTemplate.replace(regex, waitingRoomPatient.patient.firstName);
  const initialValues = { message };
  return (
    <Form
      key={formName}
      form={formName}
      onSubmit={onSubmit}
      initialValues={initialValues}
      data-test-id={formName}
      destroyOnUnmount={false}
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
  waitingRoomPatient: PropTypes.shape({}).isRequired,
  defaultTemplate: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
};
