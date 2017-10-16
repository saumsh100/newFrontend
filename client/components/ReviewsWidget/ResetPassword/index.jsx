
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { updateReview } from '../../../thunks/reviews';
import { login } from '../../../thunks/patientAuth';
import { Link, Button } from '../../library';
import ResetPasswordForm from './ResetPasswordForm';
import styles from './styles.scss';

const customSubmitButton = (
  <Button
    type="submit"
    color="red"
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
    alert(email);
    this.props.history.push('./reset-success');
    /*return this.props.login(values)
      .then(() => {
        // Important to return so that it will not navigate if errored
        return this.props.updateReview();
      })
      .then(() => {
        this.props.history.push('./submitted');
      })
      .catch(({ data, status }) => {
        // TODO: this needs proper error handling for the form
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });*/
  }

  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.header}>
          Reset Password
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
  updateReview: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(ResetPassword));
