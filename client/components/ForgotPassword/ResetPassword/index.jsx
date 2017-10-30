
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Card, Button } from '../../library';
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
    .then((data) => {
      this.setState({ submitted: true });
    });
  }

  render() {
    const {
      push,
      patientUser,
    } = this.props;

    const button = !patientUser ? (<Button
      onClick={() => {
        push('/login');
      }}
      className={styles.displayCenter}
    >
      Return to Login
    </Button>) : <div className={styles.textSuccess2}>You can now go back to the clinic's website tab.</div>;

    const display = !this.state.submitted ?  <ResetPasswordForm onSubmit={this.handleSubmit} /> :
      (<div>
          <div className={styles.textSuccess2}>Password Successfully Changed!</div>
          {button}
       </div>);

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
  patientUser: PropTypes.bool,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    resetUserPassword,
    push,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(ResetPassword);
