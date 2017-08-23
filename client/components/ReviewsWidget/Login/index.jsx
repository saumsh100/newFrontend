
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { updateReview } from '../../../thunks/reviews';
import { login } from '../../../thunks/patientAuth';
import { Link, VButton } from '../../library';
import LoginForm from '../../Availabilities/SubmitView/LoginForm';
import styles from './styles.scss';

const customSubmitButton = (
  <VButton
    type="submit"
    color="red"
    icon="email"
    className={styles.customSubmitButton}
  >
    Login with Email
  </VButton>
);

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(values) {
    return this.props.login(values)
      .then(() => {
        // Important to return so that it will not navigate if errored
        return this.props.updateReview();
      })
      .then(() => {
        this.props.history.push('/submitted');
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
      <div>
        <h2>Login</h2>
        <LoginForm
          onLogin={this.handleLogin}
          submitButton={customSubmitButton}
        />
        <Link to="/signup">
          <h3>Or Signup</h3>
        </Link>
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
