import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Field, Button } from '../../library';
import styles from './styles.scss';
import { formatPhoneNumber } from '../../../util/isomorphic';

export default function NotifyPatientForm({
  waitingRoomPatient,
  displayNameOption,
  defaultTemplate,
  formName,
  onSubmit,
  onRefresh,
  activeAccount,
}) {
  const accountInfo = activeAccount.toJS();
  const getPatientName = useCallback((patient, option) => {
    if (option === 'prefName') {
      return patient.prefName || patient.firstName;
    }
    return patient.firstName;
  }, []);

  const replaceText = (text, tag, value) => {
    const regEx = new RegExp(tag, 'g');
    return text.replace(regEx, value);
  };

  const getMessageFromTemplate = useCallback(
    (template, patient, option) => {
      const patientName = getPatientName(patient, option);
      let templateReplaced = replaceText(template, '\\$\\{displayName\\}', patientName);
      templateReplaced = replaceText(
        templateReplaced,
        '\\[patient%first&name\\]',
        patient.firstName,
      );
      templateReplaced = replaceText(templateReplaced, '\\[patient%last&name\\]', patient.lastName);
      templateReplaced = replaceText(
        templateReplaced,
        '\\[patient%display&name\\]',
        patient.prefName,
      );
      templateReplaced = replaceText(templateReplaced, '\\[practice%name\\]', accountInfo.name);
      templateReplaced = replaceText(
        templateReplaced,
        '\\[practice%phone&number\\]',
        formatPhoneNumber(accountInfo.phoneNumber),
      );

      return templateReplaced;
    },
    [accountInfo.name, accountInfo.phoneNumber, getPatientName],
  );

  const message = useMemo(
    () => getMessageFromTemplate(defaultTemplate, waitingRoomPatient.patient, displayNameOption),
    [defaultTemplate, displayNameOption, getMessageFromTemplate, waitingRoomPatient.patient],
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

      {!message && (
        <div className={styles.errorFetchingTemplateContainer}>
          We could not fetch your template. Please refresh or enter your text above.
          <Button
            onClick={onRefresh}
            iconRight="sync-alt"
            size="sm"
            border="blue"
            className={styles.refreshTemplateButton}
          >
            Refresh
          </Button>
        </div>
      )}
    </Form>
  );
}

NotifyPatientForm.propTypes = {
  displayNameOption: PropTypes.oneOf(['firstName', 'prefName']).isRequired,
  waitingRoomPatient: PropTypes.shape({}).isRequired,
  defaultTemplate: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  onRefresh: PropTypes.func.isRequired,
  activeAccount: PropTypes.shape({
    id: PropTypes.string,
    phoneNumber: PropTypes.string,
    name: PropTypes.string,
    toJS: PropTypes.func,
  }).isRequired,
};
