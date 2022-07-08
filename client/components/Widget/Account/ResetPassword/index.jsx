import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { Form } from '../../../library';
import { Field, Button } from '../../components';
import { emailValidate } from '../../../library/Form/validate';
import { resetPatientUserPassword } from '../../../../thunks/patientAuth';
import { inputTheme } from '../../theme';
import Link from '../../../library/Link';
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
    props.resetPatientUserPassword(email).catch(({ data }) => {
      throw new SubmissionError({ email: data });
    });

  return (
    <div className={styles.scrollableContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Reset Password</h1>
          <p className={styles.description}>
            Enter your email below and if you are a user, we will send you a link to reset your
            password.
            <br /> Remember your password?{' '}
            <Link className={styles.subCardLink} to="./login">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <Form form="patientResetPassword" onSubmit={handleResetPassword} ignoreSaveButton>
              <Field
                type="email"
                name="email"
                theme={inputTheme(styles)}
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
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetPatientUserPassword }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(ResetPassword));

ResetPassword.propTypes = { resetPatientUserPassword: PropTypes.func.isRequired };
