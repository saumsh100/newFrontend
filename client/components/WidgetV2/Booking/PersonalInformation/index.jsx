
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { change, formValueSelector } from 'redux-form';
import carriers from './insurance_carriers';
import { Button, Field, Form, IconButton } from '../../../library';
import SuggestionSelect from '../../../library/DropdownSuggestion/SuggestionSelect';
import { validateBirthdate, normalizeBirthdate } from '../../../library/Form/validate';
import styles from './styles.scss';

/**
 * Gender's array
 */
const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

/**
 * Find the first option that matches the passed string.
 *
 * @param {array} data
 * @param {string} value
 */
const validateField = (data, value) => data.find(item => item.value === value);

class PersonalInformation extends Component {
  /**
   * If the user selected Other as insurance carrier,
   * set the custom-carrier attribute to true.
   */
  componentWillUpdate(nextProps) {
    const { isCustomCarrier, insuranceCarrierValue, dispatch } = nextProps;
    if (insuranceCarrierValue === 'Other' && isCustomCarrier === false) {
      dispatch(change('personalInformation', 'customCarrier', true));
      dispatch(change('personalInformation', 'insuranceCarrier', ''));
    }
  }

  render() {
    const { isCustomCarrier, dispatch } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <h3 className={styles.title}>Personal Information</h3>
            <p className={styles.subtitle}>Fill your data to finish your booking.</p>
            <Form
              form="personalInformation"
              initialValues={{ customCarrier: false }}
              ignoreSaveButton
              onSubmit={values => console.log(values)}
            >
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                normalize={normalizeBirthdate}
                validate={[validateBirthdate]}
                name="birthDate"
                label="Birth Date"
              />
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                required
                name="phoneNumber"
                type="tel"
                label="Phone Number"
              />
              <div className={styles.group}>
                <Field
                  name="gender"
                  label="Gender"
                  component={SuggestionSelect}
                  required
                  theme={{
                    wrapper: styles.wrapper,
                    toggleDiv: styles.input,
                    caretIconWrapper: styles.caretIconWrapper,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    input: styles.input,
                    filled: styles.filled,
                    label: styles.label,
                    error: styles.error,
                    errorIcon: styles.errorIcon,
                    errorToggleDiv: styles.erroredInput,
                    bar: styles.bar,
                    erroredLabel: styles.erroredLabel,
                  }}
                  validateValue={value => validateField(genders, value) || value === null}
                  renderValue={value =>
                    (validateField(genders, value) && validateField(genders, value).label) || ''
                  }
                  options={genders}
                  data-test-id="gender"
                />
              </div>
              {isCustomCarrier ? (
                <Field
                  theme={{
                    inputWithIcon: styles.inputWithIcon,
                    iconClassName: styles.validationIcon,
                    erroredLabelFilled: styles.erroredLabelFilled,
                    input: styles.input,
                    filled: styles.filled,
                    label: styles.label,
                    group: styles.group,
                    error: styles.error,
                    erroredInput: styles.erroredInput,
                    bar: styles.bar,
                    erroredLabel: styles.erroredLabel,
                  }}
                  iconComponent={
                    <IconButton
                      icon="times"
                      type="light"
                      className={styles.closeIcon}
                      onClick={() => {
                        dispatch(change('personalInformation', 'customCarrier', false));
                        dispatch(
                          change('personalInformation', 'insuranceCarrier', carriers[0].value)
                        );
                      }}
                    />
                  }
                  required
                  name="insuranceCarrier"
                  label="Insurance Carrier"
                />
              ) : (
                <div className={styles.group}>
                  <Field
                    name="insuranceCarrier"
                    label="Insurance Carrier"
                    component={SuggestionSelect}
                    required
                    theme={{
                      wrapper: styles.wrapper,
                      toggleDiv: styles.input,
                      caretIconWrapper: styles.caretIconWrapper,
                      erroredLabelFilled: styles.erroredLabelFilled,
                      input: styles.input,
                      filled: styles.filled,
                      label: styles.label,
                      error: styles.error,
                      errorIcon: styles.errorIcon,
                      errorToggleDiv: styles.erroredInput,
                      bar: styles.bar,
                      erroredLabel: styles.erroredLabel,
                    }}
                    validateValue={value => validateField(carriers, value) || value === null}
                    renderValue={value =>
                      (validateField(carriers, value) && validateField(carriers, value).label) || ''
                    }
                    options={carriers}
                    data-test-id="insuranceCarrier"
                  />
                </div>
              )}

              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                label="Insurance Member ID"
                name="insuranceMemberID"
              />
              <Field
                theme={{
                  inputWithIcon: styles.inputWithIcon,
                  iconClassName: styles.validationIcon,
                  erroredLabelFilled: styles.erroredLabelFilled,
                  input: styles.input,
                  filled: styles.filled,
                  label: styles.label,
                  group: styles.group,
                  error: styles.error,
                  erroredInput: styles.erroredInput,
                  bar: styles.bar,
                  erroredLabel: styles.erroredLabel,
                }}
                label="Group ID"
                name="insuranceGroupID"
              />
              <Button type="submit" className={styles.actionButton}>
                Next
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const selector = formValueSelector('personalInformation');
  return {
    isCustomCarrier: selector(state, 'customCarrier'),
    insuranceCarrierValue: selector(state, 'insuranceCarrier'),
  };
}

export default withRouter(connect(mapStateToProps, null)(PersonalInformation));

PersonalInformation.propTypes = {
  isCustomCarrier: PropTypes.bool,
  dispatch: PropTypes.func,
  insuranceCarrierValue: PropTypes.string,
};
