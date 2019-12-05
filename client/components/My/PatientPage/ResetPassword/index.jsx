
import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Button } from '../../../library';
import ResetPasswordForm from '../../../ForgotPassword/ResetPassword/ResetPasswordForm';
import Section from '../Shared/Section';
import { resetPatientPassword } from '../../../../thunks/auth';
import accountShape from '../../../library/PropTypeShapes/accountShape';
import appointmentShape from '../../../library/PropTypeShapes/appointmentShape';
import reminderShape from '../../../library/PropTypeShapes/reminderShape';
import { locationShape } from '../../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = { submitted: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    // This just posts right back to location URL...
    return this.props
      .resetPatientPassword(this.props.location, values)
      .then(() => this.setState({ submitted: true }));
  }

  render() {
    const { submitted } = this.state;
    const { website } = this.props.params.account;
    return (
      <div>
        <Section>
          <div className={styles.header}>
            {submitted ? 'Password Reset Done' : 'Reset Password'}
          </div>
          <div className={styles.text}>
            {submitted
              ? "You're password has been changed. To go back to the online booking's portal, click on the button below."
              : 'Change your password by completing the form below.'}
          </div>
        </Section>
        <Section className={styles.formSection}>
          {submitted ? (
            <a href={`${website}?cc=book`}>
              <Button
                icon="arrow-right"
                title="Back to Online Booking"
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
  resetPatientPassword: PropTypes.func.isRequired,
  params: PropTypes.shape({
    account: PropTypes.shape(accountShape),
    appointment: PropTypes.arrayOf(PropTypes.shape(appointmentShape)),
    reminder: PropTypes.shape(reminderShape),
  }).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
};

const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      resetPatientPassword,
      push,
    },
    dispatch,
  );

export default connect(
  null,
  mapActionsToProps,
)(ResetPassword);
