
import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../library';
import ForgotPasswordForm from './ForgotPasswordForm';
import styles from './styles.scss';

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {

  }
  render() {
    //const { location: { state } } = this.props;

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
            <ForgotPasswordForm onSubmit={this.handleSubmit} />
          </Card>
        </div>
      </DocumentTitle>
    );
  }
}

export default ForgotPassword;
