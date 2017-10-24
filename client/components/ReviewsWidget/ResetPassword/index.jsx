
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { resetPatientUserPassword } from '../../../thunks/patientAuth';
import { login } from '../../../thunks/patientAuth';
import { Link, Button } from '../../library';
import ResetPasswordForm from './ResetPasswordForm';
import styles from './styles.scss';

const customSubmitButton = (
  <Button
    type="submit"
    icon="email"
    className={styles.customSubmitButton}
  >
    Reset Password
  </Button>
);

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.handleResetPassword = this.handleResetPassword.bind(this);
  }

  handleResetPassword({ email }) {
    return this.props.resetPatientUserPassword(email)
      .then(() => {
        this.props.history.push('./reset-success');
      })
      .catch(({ data }) => {
        throw new SubmissionError({ email: data });
      });
  }

  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.header}>
          Reset Password
        </div>
        <div className={styles.message}>
          Enter your email below and if you are a user, we will send you a link to reset your password.
        </div>
        <ResetPasswordForm
          onSubmit={this.handleResetPassword}
          submitButton={customSubmitButton}
        />
        <div className={styles.linkWrapper}>
          <Link to="./login">
            I remember my password
          </Link>
        </div>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  resetPatientUserPassword: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    resetPatientUserPassword
  }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(ResetPassword));
