
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

class SubmitView extends Component {
  constructor(props) {
    super(props);

    this.bookAnAppointment = this.bookAnAppointment.bind(this);
    this.setRegistrationStep = this.setRegistrationStep.bind(this);
    this.signUpAndConfirm = this.signUpAndConfirm.bind(this);
    this.confirmAndBook = this.confirmAndBook.bind(this);
  }

  bookAnAppointment(params) {
    const { startsAt, practitionerId, serviceId, reservationId } = this.props.practitionersStartEndDate.toJS();
    const domen = location.hostname == 'my.carecru.dev' ? location.hostname : null;
    const array = location.pathname.split('/');
    const accountId = array[array.length - 1];
    const paramsToPass = Object.assign({ startsAt, practitionerId, serviceId, accountId }, params, { domen });
    this.props.createPatient(paramsToPass);
    this.props.removeReservation(reservationId);
    clearInterval(this.registrationTimer);
  }

  setRegistrationStep(e) {
    e.preventDefault();
    const { setRegistrationStep, removeReservation } = this.props;
    const { reservationId } = this.props.practitionersStartEndDate.toJS();
    const array = location.pathname.split('/');
    const accountId = array[array.length - 1];
    setRegistrationStep(1, accountId);
    removeReservation(reservationId);
    clearInterval(this.registrationTimer);
  }

  renderMessages(messages) {
    return (
      <div>
        {messages.map(m => (
          <div className={styles.signup__header_title}>
            {m}
          </div>
        ))}
      </div>
    );
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
        this.props.createRequest();
      })
      .catch(() => {
        throw new SubmissionError({ confirmCode: 'Invalid code' });
      });
  }

  render() {
    const {
      isConfirming,
      isSuccessfulBooking,
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
            We have sent a confirmation code via SMS to {patientUser.phoneNumber}.
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
            onClick={closeBookingModal}
          >
            Exit
          </Button>
        </div>
      );
    }

    let timerComponent = (
      <div className={styles.timerWrapper}>
        <Timer
          className={styles.signup__header_timer}
          totalSeconds={3 * 60}
          color={bookingWidgetPrimaryColor}
        />
      </div>
    );

    if (isSuccessfulBooking) {
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
  isConfirming: PropTypes.bool.isRequired,
  isSuccessfulBooking: PropTypes.bool.isRequired,
  closeBookingModal: PropTypes.func.isRequired,
  bookingWidgetPrimaryColor: PropTypes.string,
  patientUser: PropTypes.object,
};

function mapStateToProps({ availabilities }) {
  return {
    isConfirming: availabilities.get('isConfirming'),
    isSuccessfulBooking: availabilities.get('isSuccessfulBooking'),
    patientUser: availabilities.get('patientUser'),

    // TODO: shouldn't have to go to Redux to grab this...
    bookingWidgetPrimaryColor: availabilities.getIn(['account', 'bookingWidgetPrimaryColor']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createPatient: Thunks.createPatient,
    confirmCode: Thunks.confirmCode,
    createRequest: Thunks.createRequest,
    setIsConfirming: Actions.setIsConfirming,
    closeBookingModal: Thunks.closeBookingModal,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitView);
