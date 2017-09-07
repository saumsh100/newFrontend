
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import DocumentTitle from 'react-document-title';
import { SubmissionError } from 'redux-form';
import { Card } from '../library';
import { login } from '../../thunks/auth';
import LoginForm from './LoginForm';
import CopyrightFooter from './CopyrightFooter';
import styles from './styles.scss';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(values) {
    const { location: { state } } = this.props;
    return this.props.login(values, state && state.from, true)
      .catch((err) => {
        const { data } = err;
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });
  }


  render() {
    const { location: { state }, push } = this.props;
    return (
      <DocumentTitle title="CareCru | Login">
        <div className={styles.backDrop}>
          <Card className={styles.loginForm}>
            <div className={styles.logoContainer}>
              <img
                className={styles.loginLogo}
                src="/images/logo_black.png"
                alt="CareCru Logo"
              />
            </div>
            <LoginForm onSubmit={this.handleLogin} />
            <div className={styles.forgotPassword}>
              <div
                className={styles.forgotPassword_text}
                onClick={() => {
                  push('/forgot');
                }}
              >
                Forgot your password?
              </div>
            </div>
          </Card>
          <CopyrightFooter />
        </div>
      </DocumentTitle>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    login,
    push,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(Login);
