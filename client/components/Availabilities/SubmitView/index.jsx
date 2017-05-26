
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import { Button, Timer, VButton, FBLoginButton } from '../../library';
import SignUpForm from './SignUpForm';
import ConfirmNumberForm from './ConfirmNumberForm';
import LoginForm from './LoginForm';
import * as Actions from '../../../actions/availabilities';
import * as Thunks from '../../../thunks/availabilities';
import styles from './styles.scss';

const TOTAL_SECONDS_ALLOWED = 3 * 60;

const token = {
  key: 'auth_token',

  save(value) {
    localStorage.setItem(this.key, value);
  },

  remove() {
    localStorage.removeItem(this.key);
  },

  get() {
    return localStorage.getItem(this.key);
  },
};

class SubmitView extends Component {
  constructor(props) {
    super(props);

    this.signUpAndConfirm = this.signUpAndConfirm.bind(this);
    this.confirmAndBook = this.confirmAndBook.bind(this);
  }

  componentWillMount() {
    this.props.loadPatient(token.get())
      .then(patient =>
        (patient ?
          this.props.createRequest() :
          token.remove()
        )
      );
  }

  login(credentials) {
    return this.props.loginPatient(credentials)
      .then(t => token.save(t))
      .then(() => this.props.createRequest())
      .catch(({ data, status }) => {
        if (status === 401) {
          throw new SubmissionError({
            email: data,
            password: data,
          });
        }
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

  signUpAndConfirm(values) {
    // TODO: createPatient.then(createRequest).then(setSuccessful)
    // alert(JSON.stringify(values));
    this.props.createPatient(values)
      .then(t => token.save(t))
      .then(() => this.props.setIsConfirming(true));
  }

  render() {
    const {
      isConfirming,
      isLogin,
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
            We have sent a confirmation code via SMS to {patientUser.phoneNumber}.
            Please type in the code below and submit to complete your booking.
          </div>
          <ConfirmNumberForm onSubmit={this.confirmAndBook} />
        </div>
      );
    }

    if (isLogin) {
      formComponent = (
        <div>
          <LoginForm
            className={styles.loginForm}
            onLogin={credentials => this.login(credentials)}
          />
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

    const showLoginButtons = !(isLogin || isSuccessfulBooking);

    return (
      <div className={styles.submitViewWrapper}>
        {timerComponent}
        <div className={styles.formWrapper}>
          {formComponent}
        </div>

        { showLoginButtons ? (
          <div className={styles.signup__footer}>
            <div className={styles.signup__footer_header}>
              <div className={styles.signup__footer_title}>
                ALREADY HAVE AN ACCOUNT?
              </div>

              <VButton color="blue" compact size="tiny" onClick={() => this.props.setIsLogin(true)}>Login Here</VButton>
            </div>
          </div>
        ) : null }
      </div>
    );
  }
}

SubmitView.propTypes = {
  createPatient: PropTypes.func.isRequired,
  confirmCode: PropTypes.func.isRequired,
  createRequest: PropTypes.func.isRequired,
  loginPatient: PropTypes.func.isRequired,
  loadPatient: PropTypes.func.isRequired,
  setIsConfirming: PropTypes.func.isRequired,
  setIsLogin: PropTypes.func.isRequired,
  setIsTimerExpired: PropTypes.func.isRequired,
  restartBookingProcess: PropTypes.func.isRequired,
  isTimerExpired: PropTypes.bool.isRequired,
  isConfirming: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
  isSuccessfulBooking: PropTypes.bool.isRequired,
  closeBookingModal: PropTypes.func.isRequired,
  bookingWidgetPrimaryColor: PropTypes.string,
  patientUser: PropTypes.object,
};

function mapStateToProps({ availabilities }) {
  return {
    isConfirming: availabilities.get('isConfirming'),
    isLogin: availabilities.get('isLogin'),
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
    loginPatient: Thunks.loginPatient,
    loadPatient: Thunks.loadPatient,
    confirmCode: Thunks.confirmCode,
    createRequest: Thunks.createRequest,
    createWaitSpot: Thunks.createWaitSpot,
    restartBookingProcess: Thunks.restartBookingProcess,
    setIsConfirming: Actions.setIsConfirming,
    setIsLogin: Actions.setIsLogin,
    setIsTimerExpired: Actions.setIsTimerExpired,
    closeBookingModal: Thunks.closeBookingModal,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitView);
