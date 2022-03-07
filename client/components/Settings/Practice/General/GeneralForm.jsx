import React, { useState } from 'react';
import { getFormValues, reduxForm } from 'redux-form';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field, Tooltip } from '../../../library';
import {
  emailValidate,
  notNegative,
  validateEmails,
  validateNoSpace,
} from '../../../library/Form/validate';
import FormButton from '../../../library/Form/FormButton';
import Icon from '../../../library/Icon';
import styles from './styles.scss';
import { showAlertTimeout } from '../../../../thunks/alerts';
import AccountModel from '../../../../entities/models/Account';

const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength25 = maxLength(50);
const emailValidateNull = (str) => {
  if (str && !str.length) {
    return undefined;
  }
  return emailValidate(str);
};
const maxUnitSize = (value) => value && value > 60 && 'Must be less than or equal to 60';

const GeneralForm = ({
  role,
  formValues,
  pristine,
  handleSubmit,
  change,
  initialValues,
  valid,
  activeAccount,
}) => {
  const emailValid = role === 'SUPERADMIN' ? emailValidateNull : emailValidate;
  const istwilioPhoneNumber = !!activeAccount.get('twilioPhoneNumber');

  const [allowSubmit, setAllowSubmit] = useState(false);
  const dispatch = useDispatch();

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

  function handleContactChange(e) {
    const currentVal = e.target.value;
    if (validateNoSpace(currentVal).length <= 12) {
      change('phoneNumber', currentVal);
      if (validateNoSpace(initialValues?.phoneNumber) !== validateNoSpace(currentVal)) {
        setAllowSubmit(false);
      } else {
        setAllowSubmit(true);
      }
    }
    e.preventDefault();
  }

  const handleFormSubmit = (e) => {
    if (valid) {
      if (istwilioPhoneNumber) {
        const confirmUpdate = window.confirm(
          'Do you want your patient calls to be forwarded to this new number?',
        );
        if (confirmUpdate) {
          handleSubmit();
        } else {
          change('phoneNumber', initialValues?.phoneNumber);
        }
      } else {
        handleSubmit();
      }
    } else {
      dispatch(
        showAlertTimeout({
          alert: { body: 'There is a validation error' },
          type: 'error',
        }),
      );
    }
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      data-test-id="PracticeDetailsForm123"
      onChange={(e) => e.stopPropagation()}
    >
      <Field name="name" label="Name" validate={[maxLength25]} data-test-id="name" />
      <Field name="website" label="Website" data-test-id="website" />
      <Field
        name="phoneNumber"
        label="Contact Phone Number"
        type="tel"
        data-test-id="phoneNumber"
        onChange={handleContactChange}
      />
      <Field
        name="contactEmail"
        label="Contact Email"
        validate={[emailValid]}
        data-test-id="contactEmail"
      />
      <Field name="facebookUrl" label="Facebook URL" data-test-id="facebookUrl" />
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
          <div className={styles.paddingText}>
            Disable Email Notifications for Users{' '}
            <Tooltip
              trigger={['hover']}
              overlay={
                <div className={styles.tooltipWrapper}>
                  <div className={styles.tooltipBodyRow}>
                    ON = Only sends email notifications to emails listed above
                  </div>
                  <div className={styles.tooltipBodyRow}>
                    OFF = Sends email notifications to all users AND emails listed above
                  </div>
                </div>
              }
              placement="bottom"
            >
              <span>
                <Icon icon="question-circle" size={0.9} />
              </span>
            </Tooltip>
          </div>
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
        <FormButton pristine={pristine || allowSubmit} />
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
    facebookUrl: PropTypes.string,
    contactEmail: PropTypes.string,
    notificationEmails: PropTypes.string,
    useNotificationEmails: PropTypes.bool,
  }),
  initialValues: PropTypes.shape({
    phoneNumber: PropTypes.string,
  }).isRequired,
  pristine: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
  activeAccount: PropTypes.instanceOf(AccountModel),
};

GeneralForm.defaultProps = {
  role: '',
  formValues: {
    name: '',
    website: '',
    phoneNumber: '',
    facebookUrl: '',
    contactEmail: '',
    notificationEmails: '',
    useNotificationEmails: false,
  },
  activeAccount: null,
};

const withStateForm = connect((state) => ({
  formValues: getFormValues('PracticeDetailsForm123')(state),
}))(GeneralForm);

const withReduxForm = (BaseComponent) => reduxForm()(BaseComponent);

const enhance = compose(withReduxForm);
export default enhance(withStateForm);
