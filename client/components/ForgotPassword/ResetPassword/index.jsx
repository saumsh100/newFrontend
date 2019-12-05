
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
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
    return this.props.resetUserPassword(this.props.location, values).then(() => {
      this.setState({ submitted: true });
    });
  }

  render() {
    const { submitted } = this.state;
    const display = submitted ? (
      <div>
        <div className={styles.textSuccess2}>Password Successfully Changed!</div>
        <Button onClick={() => this.props.push('/login')} className={styles.displayCenter}>
          Return to Login
        </Button>
      </div>
    ) : (
      <ResetPasswordForm
        onSubmit={this.handleSubmit}
        saveButtonProps={{
          fluid: true,
          title: 'Reset Password',
        }}
      />
    );

    return (
      <div className={styles.backDrop}>
        <Card className={styles.loginForm}>
          <div className={styles.logoContainer}>
            <img className={styles.loginLogo} src="/images/logo_black.png" alt="CareCru Logo" />
          </div>
          {display}
        </Card>
        <CopyrightFooter />
      </div>
    );
  }
}

ResetPassword.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  resetUserPassword: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      resetUserPassword,
      push,
    },
    dispatch,
  );
}

const enhance = connect(
  null,
  mapActionsToProps,
);

export default enhance(ResetPassword);
