
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

    this.state = {
      submitted: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    // This just posts right back to location URL...
    return this.props.resetUserPassword(this.props.location, values)
    .then(() => {
      this.setState({ submitted: true });
    });
  }

  render() {

    const display = !this.state.submitted ?  <ResetPasswordForm onSubmit={this.handleSubmit} /> :
    <div>Password Successfully Changed</div>;

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
          {display}
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
