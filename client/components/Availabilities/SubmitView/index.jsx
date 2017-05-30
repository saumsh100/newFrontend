
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { Button, Timer } from '../../library';
import SignUpForm from './SignUpForm';
import ConfirmNumberForm from './ConfirmNumberForm';
import * as Actions from '../../../actions/availabilities';
import * as Thunks from '../../../thunks/availabilities';
import styles from './styles.scss';

const TOTAL_SECONDS_ALLOWED = 3 * 60;

class SubmitView extends Component {
  constructor(props) {
    super(props);

    this.signUpAndConfirm = this.signUpAndConfirm.bind(this);
    this.confirmAndBook = this.confirmAndBook.bind(this);
  }

  signUpAndConfirm(values) {
    // TODO: createPatient.then(createRequest).then(setSuccessful)
    // alert(JSON.stringify(values));
    this.props.createPatient(values)
      .then(() => {
        this.props.setIsConfirming(true);
      });
  }

  confirmAndBook(values) {
    // TODO: createPatient.then(createRequest).then(setSuccessful)
    // alert(JSON.stringify(values));
    return this.props.confirmCode(values)
      .then(() => {
        this.props.hasWaitList && this.props.createWaitSpot();
        this.props.createRequest();
      })
      .catch(() => {
        throw new SubmissionError({ confirmCode: 'Invalid code' });
      });
  }

  render() {
    const {
      isConfirming,
      isTimerExpired,
      setIsTimerExpired,
      isSuccessfulBooking,
      restartBookingProcess,
      patientUser,
      closeBookingModal,
      bookingWidgetPrimaryColor,
    } = this.props;


    let formComponent = (
      <SignUpForm onSubmit={this.signUpAndConfirm} />
    );

    if (isConfirming) {
      formComponent = (
        <div>
          <div className={styles.messageWrapper}>
            We have sent a confirmation code via SMS to {patientUser.mobilePhoneNumber}.
            Please type in the code below and submit to complete your booking.
          </div>
          <ConfirmNumberForm onSubmit={this.confirmAndBook} />
        </div>
      );
    }

    if (isSuccessfulBooking) {
      formComponent = (
        <div>
          <div className={styles.messageWrapper}>
            Congratulations! You have successfully requested your appointment.
          </div>
          <Button
            icon="sign-out"
            className={styles.exitButton}
            onClick={() => {
              closeBookingModal();
              restartBookingProcess();
            }}
          >
            Exit
          </Button>
        </div>
      );
    }

    if (isTimerExpired) {
      formComponent = (
        <div>
          <div className={styles.messageWrapper}>
            Dang! Your reservation expired...
            To start again, simply click on the button below to go back and select
            the availability you desire.
          </div>
          <Button
            icon="arrow-left"
            className={styles.exitButton}
            onClick={restartBookingProcess}
          >
            Go Back
          </Button>
        </div>
      );
    }

    let timerComponent = (
      <div className={styles.timerWrapper}>
        <Timer
          className={styles.signup__header_timer}
          totalSeconds={TOTAL_SECONDS_ALLOWED}
          color={bookingWidgetPrimaryColor}
          onEnd={() => setIsTimerExpired(true)}
        />
      </div>
    );

    if (isSuccessfulBooking || isTimerExpired) {
      timerComponent = null;
    }

    return (
      <div className={styles.submitViewWrapper}>
        {timerComponent}
        <div className={styles.formWrapper}>
          {formComponent}
        </div>
        {/*<div className={styles.signup__footer}>
          <div className={styles.signup__footer_header}>
            <div className={styles.signup__footer_title}>
              ALREADY HAVE AN ACCOUNT?
            </div>
            <a className={styles.signup__footer_login} href="/login">Login here</a>
          </div>
          <a href="//www.facebook.com/" className={styles.signup__footer_facebook}>
            <span className="fa fa-facebook-official" />
            LOG IN WITH FACEBOOK
          </a>
        </div>*/}
      </div>
    );
  }
}

SubmitView.propTypes = {
  createPatient: PropTypes.func.isRequired,
  confirmCode: PropTypes.func.isRequired,
  createRequest: PropTypes.func.isRequired,
  setIsConfirming: PropTypes.func.isRequired,
  setIsTimerExpired: PropTypes.func.isRequired,
  restartBookingProcess: PropTypes.func.isRequired,
  isTimerExpired: PropTypes.bool.isRequired,
  isConfirming: PropTypes.bool.isRequired,
  isSuccessfulBooking: PropTypes.bool.isRequired,
  closeBookingModal: PropTypes.func.isRequired,
  bookingWidgetPrimaryColor: PropTypes.string,
  patientUser: PropTypes.object,
};

function mapStateToProps({ availabilities }) {
  return {
    isConfirming: availabilities.get('isConfirming'),
    isTimerExpired: availabilities.get('isTimerExpired'),
    isSuccessfulBooking: availabilities.get('isSuccessfulBooking'),
    patientUser: availabilities.get('patientUser'),
    hasWaitList: availabilities.get('hasWaitList'),

    // TODO: shouldn't have to go to Redux to grab this...
    bookingWidgetPrimaryColor: availabilities.getIn(['account', 'bookingWidgetPrimaryColor']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createPatient: Thunks.createPatient,
    confirmCode: Thunks.confirmCode,
    createRequest: Thunks.createRequest,
    createWaitSpot: Thunks.createWaitSpot,
    restartBookingProcess: Thunks.restartBookingProcess,
    setIsConfirming: Actions.setIsConfirming,
    setIsTimerExpired: Actions.setIsTimerExpired,
    closeBookingModal: Thunks.closeBookingModal,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitView);
