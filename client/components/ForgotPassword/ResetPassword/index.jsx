import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from '../../library';
import ResetPasswordForm from './ResetPasswordForm';
import { resetUserPassword } from '../../../thunks/auth';
import styles from '../reskin-styles.scss';
import CopyrightFooter from '../../Login/CopyrightFooter/index';
import SuccessChange from './SuccessChange';

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

  backToLoginScreen() {
    this.props.push('/login');
  }

  render() {
    const { submitted } = this.state;
    const display = submitted ? (
      <SuccessChange backToLoginScreen={() => this.props.push('/login')} />
    ) : (
      <>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.text}>Enter a new password for the CareCru account.</p>
        <ResetPasswordForm onSubmit={this.handleSubmit} />
      </>
    );

    return (
      <div className={styles.backDrop}>
        <Card className={styles.loginForm}>{display}</Card>
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

const enhance = connect(null, mapActionsToProps);

export default enhance(ResetPassword);
