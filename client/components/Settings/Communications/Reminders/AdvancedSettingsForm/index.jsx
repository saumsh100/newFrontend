
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import {
  Form,
  Field,
  Grid,
  Row,
  Col,
} from '../../../../library';
import { validateJsonString } from '../../../../../../server/util/isoValidators';
import styles from './styles.scss';

const formName = reminder => `advancedSettingsReminders_${reminder.id}`;
const allowedKeys = ['reason', 'isPreConfirmed'];
const validateCustomConfirmJson = (val) => {
  if (!validateJsonString(val, allowedKeys)) {
    return 'Invalid Data Value';
  }
};

const uuidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validateOmitPractitionerArray = (val) => {
  if (!val) return;
  const array = val.split(',');
  const predicate = v => !uuidRegExp.test(v);
  if (array.some(predicate)) {
    return 'Must UUIDs separated by \',\' with no spaces';
  }
};

const isValidTime = (val) => {
  const array = val.split(':');
  if (array.length !== 3 || val.length !== 8) {
    return 'HH:MM:SS';
  }

  const hh = parseInt(array[0]);
  if (hh < 0 || 24 < hh) {
    return 'HH:MM:SS';
  }

  const mm = parseInt(array[1]);
  if (mm < 0 || 60 <= mm) {
    return 'Minutes must be less than 60';
  }

  const r = mm % 5;
  if (r !== 0) {
    return 'Minutes must be increments of 5';
  }

  const ss = parseInt(array[2]);
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
    omitPractitionerIds,
    dontSendWhenClosed,
    isDaily,
    dailyRunTime,
  } = reminder;

  const initialValues = {
    ignoreSendIfConfirmed,
    isCustomConfirm,
    customConfirmString: customConfirmData ? JSON.stringify(customConfirmData) : '',
    omitPractitionerIdsString: omitPractitionerIds.join(','),
    dontSendWhenClosed,
    isDaily,
    dailyRunTime,
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
        name="ignoreSendIfConfirmed"
        label="Ignore Send If Already Confirmed?"
      />
      <Field
        className={styles.toggle}
        component="Toggle"
        name="isCustomConfirm"
        label="Is Custom Confirm?"
      />
      {isCustomConfirmValue ?
        <Field
          required
          name="customConfirmString"
          label="Custom Confirm Data"
          validate={[validateCustomConfirmJson]}
        />
      : null}
      <Field
        name="omitPractitionerIdsString"
        label="Omit Practitioner IDs"
        validate={[validateOmitPractitionerArray]}
      />
      <Field
        className={styles.toggle}
        component="Toggle"
        name="dontSendWhenClosed"
        label="Don't Sent When Closed?"
      />
      <Field
        className={styles.toggle}
        component="Toggle"
        name="isDaily"
        label="Only Run Daily?"
      />
      {isDailyValue ?
        <Field
          required
          name="dailyRunTime"
          label="Daily Run Time"
          validate={[isValidTime]}
        />
        : null}
    </Form>
  );
}

AdvancedSettingsForm.propTypes = {
  reminder: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function mapStateToProps(state, { reminder }) {
  const values = getFormValues(formName(reminder))(state);
  return {
    isCustomConfirmValue: values && values.isCustomConfirm,
    isDailyValue: values && values.isDaily,
  };
}

export default connect(mapStateToProps, null)(AdvancedSettingsForm);
