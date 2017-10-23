
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { updateReview } from '../../../thunks/reviews';
import { login } from '../../../thunks/patientAuth';
import { Link, Button } from '../../library';
import LoginForm from '../../Availabilities/SubmitView/LoginForm';
import styles from './styles.scss';

const customSubmitButton = (
  <Button
    type="submit"
    icon="email"
    className={styles.customSubmitButton}
  >
    Login and continue
  </Button>
);

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(values) {
    return this.props.login(values)
      .then(() => {
        // TODO: this should be conditional based on where the component came from
        // Important to return so that it will not navigate if errored
        // return this.props.updateReview();
      })
      .then(() => {
        // TODO: this should be conditional based on where the component came from
        this.props.history.push('./book/review');
      })
      .catch(({ data, status }) => {
        // TODO: this needs proper error handling for the form
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });
  }

  render() {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.header}>
          Confirm your request
        </div>
        <div className={styles.subHeader}>
          Don't have an account?
        </div>
        <div className={styles.message}>
          Sign up for an account to confirm your request.
        </div>
        <Link to="./signup">
          <Button
            className={styles.joinButton}
          >
            Join now
          </Button>
        </Link>
        <div className={styles.score}>
          <hr />
          <span className={styles.scoreText}>
            or
          </span>
        </div>
        <div className={styles.subHeader}>
          If you have an account, sign in.
        </div>
        <LoginForm
          className={styles.loginFormWrapper}
          onLogin={this.handleLogin}
          submitButton={customSubmitButton}
        />
        <div className={styles.linkWrapper}>
          <Link to="./reset">
            Forgot your password?
          </Link>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  updateReview: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    login,
    updateReview,
  }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(Login));
