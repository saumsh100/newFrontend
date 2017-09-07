
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import javaParent from '../../../util/javaParent';
import { login } from '../../../thunks/auth';
import { Link, VButton } from '../../library';
import LoginForm from '../../Login/LoginForm';
import styles from './styles.scss';

const customSubmitButton = (
  <VButton
    type="submit"
    color="red"
    icon="email"
    className={styles.customSubmitButton}
  >
    Log In
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
        javaParent('onLoginSuccess', {
          username: values.email,
          password: values.password,
          token: window.localStorage.getItem('token'),
        });
      })
      .then(() => {
        this.props.history.push('./');
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
        <div className={styles.logo} />
        <div className={styles.header}>
          Welcome to CareCru.
        </div>
        <div className={styles.subHeader}>
          Get started by logging in below.
        </div>
        <LoginForm
          onSubmit={this.handleLogin}
          submitButton={customSubmitButton}
        />
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
  }, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(Login));
