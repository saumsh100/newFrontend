
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { isValidUUID, validateJsonString } from '@carecru/isomorphic';
import { Form, Field } from '../../../../library';
import { reminderShape } from '../../../../library/PropTypeShapes';
import styles from './styles.scss';

const formName = reminder => `advancedSettingsReminders_${reminder.id}`;
const allowedKeys = ['reason', 'isPreConfirmed'];
const validateCustomConfirmJson = (val) => {
  if (!validateJsonString(val, allowedKeys)) {
    return 'Invalid Data Value';
  }
};

const validateOmitIdsArray = (val) => {
  if (!val) return;
  const array = val.split(',');
  const predicate = v => !isValidUUID(v);
  if (array.some(predicate)) {
    return "Must UUIDs separated by ',' with no spaces";
  }
};

const isValidTime = (val) => {
  if (!val) return;
  const array = val.split(':');
  if (array.length !== 3 || val.length !== 8) {
    return 'HH:MM:SS';
  }

  const hh = parseInt(array[0], 10);
  if (hh < 0 || hh > 24) {
    return 'HH:MM:SS';
  }

  const mm = parseInt(array[1], 10);
  if (mm < 0 || mm >= 60) {
    return 'Minutes must be less than 60';
  }

  const r = mm % 5;
  if (r !== 0) {
    return 'Minutes must be increments of 5';
  }

  const ss = parseInt(array[2], 10);
  if (ss !== 0) {
    return 'Seconds must be zero';
  }
};

function AdvancedSettingsForm(props) {
  const { reminder, onSubmit, isCustomConfirmValue, isDailyValue } = props;
  const {
    ignoreSendIfConfirmed,
    isCustomConfirm,
    customConfirmData,
    omitChairIds,
    omitPractitionerIds,
    dontSendWhenClosed,
    isDaily,
    dailyRunTime,
    isConfirmable,
    startTime,
  } = reminder;

  const initialValues = {
    ignoreSendIfConfirmed,
    isCustomConfirm,
    customConfirmString: customConfirmData ? JSON.stringify(customConfirmData) : '',
    omitChairIdsString: omitChairIds.join(','),
    omitPractitionerIdsString: omitPractitionerIds.join(','),
    dontSendWhenClosed,
    isDaily,
    dailyRunTime,
    isConfirmable,
    startTime,
  };

  return (
    <Form
      form={formName(reminder)}
      onSubmit={onSubmit}
      initialValues={initialValues}
      ignoreSaveButton
    >
      <Field
        className={styles.toggle}
        component="Toggle"
        name="isConfirmable"
        label="Is Confirmable?"
      />

      <Field
        className={styles.toggle}
        component="Toggle"
        name="ignoreSendIfConfirmed"
        label="Ignore Send If Already Confirmed?"
      />
      <Field
        className={styles.toggle}
        component="Toggle"
        name="isCustomConfirm"
        label="Is Custom Confirm?"
      />
      {isCustomConfirmValue && (
        <Field
          required
          name="customConfirmString"
          label="Custom Confirm Data"
          validate={[validateCustomConfirmJson]}
        />
      )}
      <Field
        name="omitPractitionerIdsString"
        label="Omit Practitioner IDs"
        validate={[validateOmitIdsArray]}
      />
      <Field name="omitChairIdsString" label="Omit Chair IDs" validate={[validateOmitIdsArray]} />
      <Field
        className={styles.toggle}
        component="Toggle"
        name="dontSendWhenClosed"
        label="Don't Sent When Closed?"
      />
      <Field className={styles.toggle} component="Toggle" name="isDaily" label="Only Run Daily?" />
      {isDailyValue && (
        <Field required name="dailyRunTime" label="Daily Run Time" validate={[isValidTime]} />
      )}
      <Field name="startTime" label="Earliest Send Time" validate={[isValidTime]} />
    </Form>
  );
}

AdvancedSettingsForm.propTypes = {
  reminder: PropTypes.shape(reminderShape).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isCustomConfirmValue: PropTypes.bool.isRequired,
  isDailyValue: PropTypes.bool.isRequired,
};

function mapStateToProps(state, { reminder }) {
  const values = getFormValues(formName(reminder))(state);
  return {
    isCustomConfirmValue: !!values && values.isCustomConfirm,
    isDailyValue: !!values && values.isDaily,
  };
}

export default connect(
  mapStateToProps,
  null,
)(AdvancedSettingsForm);
