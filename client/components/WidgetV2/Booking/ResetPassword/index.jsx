
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { Form, Field, Button } from '../../../library';
import { emailValidate } from '../../../library/Form/validate';
import { resetPatientUserPassword } from '../../../../thunks/patientAuth';
import styles from './styles.scss';

function ResetPassword(props) {
  /**
   * Dispatch the resetPassword event,
   * using the provided email from the user.
   * Show errors if something is wrong,
   * otherwise push the user to the reset-success page.
   *
   * @param {string} email
   */
  const handleResetPassword = ({ email }) =>
    props
      .resetPatientUserPassword(email)
      .then(() => props.history.push('./reset-success'))
      .catch(({ data }) => {
        throw new SubmissionError({ email: data });
      });

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h3 className={styles.title}>Reset</h3>
          <p className={styles.subtitle}>
            Enter your email below and if you are a user, we will send you a link to reset your
            password.
          </p>
          <Form form="patientResetPassword" onSubmit={handleResetPassword} ignoreSaveButton>
            <Field
              type="email"
              name="email"
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
              label="Email"
              validate={[emailValidate]}
            />
            <Button type="submit" className={styles.actionButton}>
              Reset your password
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetPatientUserPassword,
    },
    dispatch
  );
}

export default withRouter(connect(null, mapDispatchToProps)(ResetPassword));

ResetPassword.propTypes = {
  resetPatientUserPassword: PropTypes.func,
};