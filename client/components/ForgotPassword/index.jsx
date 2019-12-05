
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
import ForgotPasswordForm from './ForgotPasswordForm';
import EmailSuccess from './EmailSuccess';
import styles from './styles.scss';
import { resetPassword } from '../../thunks/auth';
import CopyrightFooter from '../Login/CopyrightFooter';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFalseEmail: false,
      submitted: false,
      email: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.resetPassword(values.email).then(
      () => {
        this.setState({
          isFalseEmail: false,
          submitted: true,
          email: values.email,
        });
      },
      (reason) => {
        console.error(reason);
        this.setState({
          isFalseEmail: true,
          submitted: false,
          email: values.email,
        });
      },
    );
  }

  render() {
    return (
      <DocumentTitle title="CareCru | Reset Password">
        <div className={styles.backDrop}>
          <Card className={styles.loginForm}>
            <div className={styles.logoContainer}>
              <img className={styles.loginLogo} src="/images/logo_black.png" alt="CareCru Logo" />
            </div>
            <div className={styles.text}>
              Enter your email below and if you are a user, we will send you a link to reset your
              password.
            </div>
            {this.state.isFalseEmail && <div className={styles.textError}>Email not found.</div>}
            {this.state.submitted ? (
              <EmailSuccess email={this.state.email} push={this.props.push} />
            ) : (
              <div>
                <ForgotPasswordForm onSubmit={this.handleSubmit} />
                <div
                  className={styles.textLogin}
                  tabIndex={0}
                  onKeyDown={e => e.keyCode === '13' && this.props.push('/login')}
                  role="button"
                  onClick={() => {
                    this.props.push('/login');
                  }}
                >
                  Back to Login Page
                </div>
              </div>
            )}
          </Card>
          <CopyrightFooter />
        </div>
      </DocumentTitle>
    );
  }
}

ForgotPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      resetPassword,
      push,
    },
    dispatch,
  );
}

const enhance = connect(
  null,
  mapActionsToProps,
);

export default enhance(ForgotPassword);
