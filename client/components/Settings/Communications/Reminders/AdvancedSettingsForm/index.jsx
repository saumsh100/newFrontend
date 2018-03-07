
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

function AdvancedSettingsForm(props) {
  const { reminder, onSubmit, isCustomConfirmValue } = props;
  const { ignoreSendIfConfirmed, isCustomConfirm, customConfirmData, omitPractitionerIds } = reminder;
  const initialValues = {
    ignoreSendIfConfirmed: ignoreSendIfConfirmed,
    isCustomConfirm: isCustomConfirm,
    customConfirmString: customConfirmData ? JSON.stringify(customConfirmData) : '',
    omitPractitionerIdsString: omitPractitionerIds.join(','),
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
    </Form>
  );
}

AdvancedSettingsForm.propTypes = {
  reminder: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function mapStateToProps(state, { reminder }) {
  const values = getFormValues(formName(reminder))(state);
  return { isCustomConfirmValue: values && values.isCustomConfirm };
}

export default connect(mapStateToProps, null)(AdvancedSettingsForm);
