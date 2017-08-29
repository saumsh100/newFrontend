
import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
import ForgotPasswordForm from './ForgotPasswordForm';
import EmailSuccess from './EmailSuccess';
import styles from './styles.scss';
import { resetPassword  } from '../../thunks/auth';

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitted: false,
      email: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.resetPassword(values.email);
    this.setState({
      submitted: true,
      email: values.email,
    });
  }

  render() {
    const { location: { state }, push } = this.props;

    return (
      <DocumentTitle title="CareCru | Reset Password">
        <div className={styles.backDrop}>
          <Card className={styles.loginForm}>
            <div className={styles.logoContainer}>
              <img
                className={styles.loginLogo}
                src="/images/logo_black.png"
                alt="CareCru Logo"
              />
            </div>
            <div className={styles.text}>Enter your email below and if you are a user, we will send you a link to reset your password.</div>
            {this.state.submitted ?
              <EmailSuccess email={this.state.email} push={push} />
              :
              <div>
                <ForgotPasswordForm onSubmit={this.handleSubmit}/>
                <div
                  className = {styles.textLogin}
                  onClick={() => {
                    push('/login');
                  }}
                >
                Back to Login Page
                </div>
              </div>
            }
          </Card>
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
  return bindActionCreators({
    resetPassword,
    push,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(ForgotPassword);

