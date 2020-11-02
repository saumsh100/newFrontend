
import React from 'react';
import { getFormValues, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from '../../../library';
import { emailValidate, notNegative, validateEmails } from '../../../library/Form/validate';
import FormButton from '../../../library/Form/FormButton';
import Icon from '../../../library/Icon';
import Tooltip from '../../../Tooltip';
import styles from './styles.scss';

const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);
const maxLength25 = maxLength(50);

const emailValidateNull = (str) => {
  if (str && !str.length) {
    return undefined;
  }
  return emailValidate(str);
};

const maxUnitSize = value => value && value > 60 && 'Must be less than or equal to 60';

const GeneralForm = ({ role, formValues, pristine, handleSubmit, change }) => {
  const emailValid = role === 'SUPERADMIN' ? emailValidateNull : emailValidate;

  function onNotificationEmailsChange(e) {
    const { useNotificationEmails } = formValues;
    const currentVal = e.target.value;
    const previousVal = formValues.notificationEmails;
    const onInitialChange = previousVal.length === 0 && currentVal.length > 0;

    if (currentVal.length === 0 && useNotificationEmails === true) {
      change('useNotificationEmails', false);
    }

    if (onInitialChange && useNotificationEmails === false) {
      change('useNotificationEmails', true);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-test-id="PracticeDetailsForm123"
      onChange={e => e.stopPropagation()}
    >
      <Field name="name" label="Name" validate={[maxLength25]} data-test-id="name" />
      <Field name="website" label="Website" data-test-id="website" />
      <Field
        name="phoneNumber"
        label="Contact Phone Number"
        type="tel"
        data-test-id="phoneNumber"
      />
      <Field
        name="contactEmail"
        label="Contact Email"
        validate={[emailValid]}
        data-test-id="contactEmail"
      />
      <Field
        name="unit"
        label="Schedule Unit Value"
        type="number"
        step={5}
        validate={[notNegative, maxUnitSize]}
        data-test-id="unit"
      />
      <Field
        name="notificationEmails"
        label="Notification Email(s)"
        validate={[validateEmails]}
        data-test-id="notificationEmails"
        onChange={onNotificationEmailsChange}
      />
      <div className={styles.paddingField}>
        <div className={styles.paddingField_flex}>
          <div className={styles.paddingText}>Disable Email Notifications for Users</div>
          <Tooltip
            placement="below"
            body={
              <div className={styles.tooltipBody}>
                <div className={styles.tooltipBodyRow}>
                  ON = Only sends email notifications to emails listed above
                </div>
                <div className={styles.tooltipBodyRow}>
                  OFF = Sends email notifications to all users AND emails listed above
                </div>
              </div>
            }
          >
            <Icon icon="question-circle" size={0.9} />
          </Tooltip>
          <div className={styles.paddingField_toggle} data-test-id="toggle_useNotificationEmails">
            <Field
              component="Toggle"
              name="useNotificationEmails"
              disabled={!formValues.notificationEmails}
            />
          </div>
        </div>
      </div>
      <div className={styles.submitButton}>
        <FormButton pristine={pristine} />
      </div>
    </form>
  );
};

GeneralForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  role: PropTypes.string,
  formValues: PropTypes.shape({
    name: PropTypes.string,
    website: PropTypes.string,
    phoneNumber: PropTypes.string,
    contactEmail: PropTypes.string,
    notificationEmails: PropTypes.string,
    useNotificationEmails: PropTypes.bool,
  }),
  pristine: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
};

GeneralForm.defaultProps = {
  role: '',
  formValues: {
    name: '',
    website: '',
    phoneNumber: '',
    contactEmail: '',
    notificationEmails: '',
    useNotificationEmails: false,
  },
};

const withStateForm = connect(state => ({
  formValues: getFormValues('PracticeDetailsForm123')(state),
}))(GeneralForm);

const withReduxForm = BaseComponent => reduxForm()(BaseComponent);

const enhance = compose(withReduxForm);
export default enhance(withStateForm);
