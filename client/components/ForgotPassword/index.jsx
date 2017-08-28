
import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
import ForgotPasswordForm from './ForgotPasswordForm';
import styles from './styles.scss';
import { resetPassword  } from '../../thunks/auth';

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitted: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.resetPassword(values.email);
    this.setState({
      submitted: true,
    });
  }

  render() {
    const { location: { state } } = this.props;

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
            {this.state.submitted ? <div className={styles.submitText}>
              Please check your email and follow the steps to reset your password.
              </div> : <div>
                <div className={styles.header}>Forgot Password?</div>
                <div className={styles.text}>You can reset your password here.</div>
                <ForgotPasswordForm onSubmit={this.handleSubmit} />
              </div>}
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

ForgotPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    resetPassword,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(ForgotPassword);

