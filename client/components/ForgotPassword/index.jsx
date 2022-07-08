import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
import ForgotPasswordForm from './ForgotPasswordForm';
import EmailSuccess from './EmailSuccess';
import styles from './reskin-styles.scss';
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

  handleBackToSignIn = () => {
    this.props.push('/login');
  };

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
          {this.state.submitted ? (
            <EmailSuccess email={this.state.email} push={this.props.push} />
          ) : (
            <Card className={styles.loginForm}>
              <h1 className={styles.title}>Forgot Password</h1>
              <div className={styles.text}>We’ll send a recovery link to your email</div>

              <div>
                <ForgotPasswordForm
                  onSubmit={this.handleSubmit}
                  handleBackToSignIn={this.handleBackToSignIn}
                  isFalseEmail={this.state.isFalseEmail}
                />
              </div>
            </Card>
          )}
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

const enhance = connect(null, mapActionsToProps);

export default enhance(ForgotPassword);
