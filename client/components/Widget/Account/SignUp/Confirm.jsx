import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { Form } from '../../../library';
import { Field, Button } from '../../components';
import { maxDigits } from '../../../library/Form/normalize';
import { numDigitsValidate } from '../../../library/Form/validate';
import { confirmCode, resendPinCode } from '../../../../thunks/availabilities';
import { inputTheme } from '../../theme';
import styles from './styles.scss';

function SignUpConfirm({ handleConfirmationCode, patientPhoneNumber, handleResendPinCode }) {
  /**
   * If it's a valid PIN code send the user back,
   * otherwise show the errors to the user.
   *
   * @param {object} values
   */
  const handleConfirmation = (values) =>
    handleConfirmationCode(values).catch(({ data }) => {
      throw new SubmissionError({
        confirmCode: data,
      });
    });

  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Confirm</h1>
          <p className={styles.description}>
            We have sent a confirmation code via SMS to{' '}
            <span className={styles.phone}>{patientPhoneNumber}</span>. <br />
            Please type in the code below and submit to complete your booking request. <br />
            If you did not receive your SMS and want it sent again, click
            <Button
              className={styles.linkButton}
              onClick={(e) => {
                e.preventDefault();
                handleResendPinCode();
              }}
            >
              here
            </Button>
            .
          </p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <Form form="confirmNumberForm" onSubmit={handleConfirmation} ignoreSaveButton>
              <Field
                required
                name="confirmCode"
                label="Confirmation Code"
                validate={[numDigitsValidate(4)]}
                normalize={maxDigits(4)}
                theme={inputTheme(styles)}
              />
              <Button type="submit" className={styles.actionButton}>
                Confirm Signup
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

SignUpConfirm.propTypes = {
  handleResendPinCode: PropTypes.func.isRequired,
  handleConfirmationCode: PropTypes.func.isRequired,
  patientPhoneNumber: PropTypes.string.isRequired,
};

function mapStateToProps({ auth }) {
  return {
    patientPhoneNumber: auth.get('patientUser') && auth.get('patientUser').get('phoneNumber'),
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUpConfirm));
