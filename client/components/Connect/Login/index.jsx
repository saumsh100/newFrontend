
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
    color="dark"
    icon="email"
    className={styles.customSubmitButton}
  >
    Get Started
  </VButton>
);

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(values) {
    return this.props
      .login({ values, connect: true })
      .then(() => {
        window.JavaParent &&
          window.JavaParent.onLoginSuccess &&
          window.JavaParent.onLoginSuccess(
            values.email,
            values.password,
            window.localStorage.getItem('token'),
          );
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
      <div className={styles.loginWrapper}>
        <div className={styles.logoWrapper}>
          <img
            className={styles.logo}
            src="/images/carecru_logo_collapsed_dark.png"
            alt="CareCru Logo"
          />
        </div>
        <div className={styles.header}>Welcome to CareCru.</div>
        <div className={styles.subHeader}>Get started by logging in below.</div>
        <LoginForm
          onSubmit={this.handleLogin}
          submitButton={customSubmitButton}
          className={styles.loginForm}
        />
      </div>
    );
  }
}

Login.propTypes = {
  updateReview: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login,
    },
    dispatch,
  );
}

export default withRouter(connect(
  null,
  mapDispatchToProps,
)(Login));
