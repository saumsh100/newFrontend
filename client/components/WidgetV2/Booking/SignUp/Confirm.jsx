
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { Form, Field, Button } from '../../../library';
import { maxDigits } from '../../../library/Form/normalize';
import { numDigitsValidate } from '../../../library/Form/validate';
import { historyShape } from '../../../library/PropTypeShapes/routerShapes';
import { confirmCode, resendPinCode } from '../../../../thunks/availabilities';
import styles from './styles.scss';

function SignUpConfirm({
  handleConfirmationCode,
  patientPhoneNumber,
  handleResendPinCode,
  history,
}) {
  /**
   * If it's a valid PIN code send the user back,
   * otherwise show the errors to the user.
   *
   * @param {object} values
   */
  const handleConfirmation = values =>
    handleConfirmationCode(values)
      .then(() => {
        history.push('../book');
      })
      .catch(({ data }) => {
        throw new SubmissionError({
          confirmCode: data,
        });
      });

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h3 className={styles.title}>Confirm</h3>
          <p className={styles.subtitle}>
            We have sent a confirmation code via SMS to{' '}
            <span className={styles.phone}>{patientPhoneNumber}</span>. <br />
            Please type in the code below and submit to complete your booking
            request. <br />
            If you did not receive your SMS and want it sent again, click
            {
              <Button
                className={styles.linkButton}
                onClick={(e) => {
                  e.preventDefault();
                  handleResendPinCode();
                }}
              >
                here
              </Button>
            }.
          </p>
          <Form
            form="confirmNumberForm"
            onSubmit={handleConfirmation}
            ignoreSaveButton
          >
            <Field
              required
              name="confirmCode"
              label="Confirmation Code"
              validate={[numDigitsValidate(4)]}
              normalize={maxDigits(4)}
              theme={{
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
            />
            <Button type="submit" className={styles.actionButton}>
              Confirm Signup
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

SignUpConfirm.propTypes = {
  handleResendPinCode: PropTypes.func,
  handleConfirmationCode: PropTypes.func,
  history: PropTypes.shape(historyShape),
  patientPhoneNumber: PropTypes.string,
};

function mapStateToProps({ auth }) {
  return {
    patientPhoneNumber: auth.get('patientUser').get('phoneNumber'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      handleConfirmationCode: confirmCode,
      handleResendPinCode: resendPinCode,
    },
    dispatch,
  );
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpConfirm));
