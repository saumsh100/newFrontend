
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Card, Button } from '../../../library';
import ResetPasswordForm from '../../../ForgotPassword/ResetPassword/ResetPasswordForm';
import Section from '../Shared/Section';
import { resetUserPassword } from '../../../../thunks/auth';
import styles from './styles.scss';

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
    return this.props
      .resetUserPassword(this.props.location, values)
      .then(data => this.setState({ submitted: true }));
  }

  render() {
    // TODO: this needs to be its own route! cause we need a /submitted route that the backend
    // TODO: can reroute to
    const { submitted } = this.state;
    const { account } = this.props.params;
    return (
      <div>
        <Section>
          <div className={styles.header}>
            {submitted ? 'Password Reset Done' : 'Reset Password'}
          </div>
          <div className={styles.text}>
            {submitted
              ? "You're password has been changed. To go back to the online booking's login portal, click on the button below."
              : 'Change your password by completing the form below.'}
          </div>
        </Section>
        <Section className={styles.formSection}>
          {submitted ? (
            <a href={`${account.website}?cc=login`}>
              <Button
                // fluid
                icon="arrow-right"
                title="Back to Login"
                className={styles.backToLoginButton}
              />
            </a>
          ) : (
            <ResetPasswordForm
              onSubmit={this.handleSubmit}
              saveButtonProps={{
                fluid: true,
                title: 'Reset Password',
                className: styles.submitButton,
              }}
            />
          )}
        </Section>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  patientUser: PropTypes.bool,
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
