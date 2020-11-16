
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from '../../../library/index';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import styles from './styles.scss';
import Tooltip from '../../../Tooltip';
import Icon from '../../../library/Icon';

export default function SchedulingUrlForm({ handleSubmit, activeAccount }) {
  const initialValues = {
    onlineBookingUrl: activeAccount.get('onlineBookingUrl') || '',
  };

  return (
    <Form
      form="onlineBookingUrlForm"
      onSubmit={handleSubmit}
      className={styles.preferencesForm}
      initialValues={initialValues}
      data-test-id="onlineBookingUrlForm"
      alignSave="left"
    >
      <div className={styles.formContainer_pickerField}>
        <label>If using a different URL for Online Scheduling, please enter here</label>
        <Tooltip
          placement="below"
          body="If left empty, this will revert back to the Practice Website URL"
        >
          <Icon icon="question-circle" size={0.9} />
        </Tooltip>
        <div className={styles.inputFieldWrapper}>
          <Field label="Website URL" name="onlineBookingUrl" />
        </div>
      </div>
    </Form>
  );
}

SchedulingUrlForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  activeAccount: PropTypes.shape(AccountShape).isRequired,
};
