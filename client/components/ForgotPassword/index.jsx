
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
//import invite from '../../thunks/inviteSignup';
import DocumentTitle from 'react-document-title';
import ForgotPasswordForm from './InviteForm';
import styles from './styles.scss';

class ForgotPassword extends Component {
  render() {
    const { location: { state } } = this.props;

    return (
      <DocumentTitle title="CareCru | Recover Password">
        <div className={styles.backDrop}>
          <Card className={styles.loginForm}>
            <div className={styles.logoContainer}>
              <img
                className={styles.loginLogo}
                src="/images/logo_black.png"
                alt="CareCru Logo"
              />
            </div>
            <ForgotPasswordForm onSubmit={() => {}} />
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

export default ForgotPassword;
