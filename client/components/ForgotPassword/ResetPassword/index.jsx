
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../../library';
import ResetPasswordForm from './ResetPasswordForm';
import { resetUserPassword } from '../../../thunks/auth';
import styles from '../styles.scss';
import CopyrightFooter from '../../Login/CopyrightFooter/index';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    // This just posts right back to location URL...
    this.props.resetUserPassword(this.props.location, values);
  }

  render() {
    return (
      <div className={styles.backDrop}>
        <Card className={styles.loginForm}>
          <div className={styles.logoContainer}>
            <img
              className={styles.loginLogo}
              src="/images/logo_black.png"
              alt="CareCru Logo"
            />
          </div>
          <ResetPasswordForm onSubmit={this.handleSubmit} />
        </Card>
        <CopyrightFooter />
      </div>
    );
  }
}

ResetPassword.propTypes = {

};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    resetUserPassword,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(ResetPassword);


