
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SubmissionError } from 'redux-form';
import classNames from 'classnames';
import { Button, Timer, VButton, Avatar, DropdownMenu, MenuItem } from '../../library';
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

    this.state = {
      loading: false,
    };

    this.signUpAndConfirm = this.signUpAndConfirm.bind(this);
    this.confirmAndBook = this.confirmAndBook.bind(this);
  }

  componentWillMount() {
    console.log(token.get());
    this.props.loadPatient(token.get())
      .then(patient => (!patient) && token.remove());
  }

  login(credentials) {
    return this.props.loginPatient(credentials)
      .then((t) => {
        token.save(t);
      })
      .catch(({ data, status }) => {
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });
  }

  logout() {
    token.remove();
    this.props.setPatientUser(null);
  }

  confirmAndBook(values) {
    // TODO: createPatient.then(createRequest).then(setSuccessful)
    // alert(JSON.stringify(values));
    this.setState({ loading: true });
    return this.props.confirmCode(values)
      .then(() => {
        this.props.hasWaitList && this.props.createWaitSpot();
        this.props.createRequest();
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
        throw new SubmissionError({ confirmCode: 'Invalid code' });
      });
  }

  signUpAndConfirm(values) {
    // TODO: createPatient.then(createRequest).then(setSuccessful)
    // alert(JSON.stringify(values));
    this.setState({ loading: true });
    this.props.createPatient(values)
      .then(t => token.save(t))
      .then(() => {
        this.props.setIsConfirming(true);
        this.setState({ loading: false });
      })
      .catch((err) => {
        const { data } = err;
        this.setState({ loading: false });
        throw new SubmissionError({
          _error: data,
        });
      });
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
      setIsLogin,
    } = this.props;

    // If patient is authenticated, display <BookView />
    // If patient is !authenticated, display <SignUpView />
    // TODO: refactor this using Memory Router

    const loginHereAnchor = (
      <a
        href="#login"
        onClick={(e) => { e.preventDefault(); setIsLogin(true); }}
      >
        Login here
      </a>
    );

    let formComponent = (
      <div>
        <SignUpForm onSubmit={this.signUpAndConfirm} />
        <div className={styles.alreadyHaveWrapper}>
          Already have an account? {loginHereAnchor}
        </div>
      </div>
    );

    if (patientUser && isConfirming) {
      formComponent = (
        <div>
          <div className={styles.messageWrapper}>
            We have sent a confirmation code via SMS to {patientUser.get('phoneNumber')}.
            Please type in the code below and submit to complete your booking.
          </div>
          <ConfirmNumberForm onSubmit={this.confirmAndBook} />
        </div>
      );
    }

    if (isLogin) {
      const signupHereAnchor = (
        <a
          href="#signup"
          onClick={(e) => { e.preventDefault(); setIsLogin(false); }}
        >
          Sign up here
        </a>
      );

      formComponent = (
        <div>
          <LoginForm
            className={styles.loginForm}
            onLogin={credentials => this.login(credentials)}
          />
          <div className={styles.alreadyHaveWrapper}>
            Don't have an account? {signupHereAnchor}
          </div>
        </div>
      );
    }

    if (isSuccessfulBooking) {
      formComponent = (
        <div>
          <div className={styles.messageWrapper}>
            Congratulations! You have successfully requested your appointment.
          </div>
          <VButton
            icon="sign-out"
            className={styles.exitButton}
            onClick={() => {
              closeBookingModal();
              restartBookingProcess();
            }}
          >
            Exit
          </VButton>
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
          <VButton
            icon="arrow-left"
            className={styles.exitButton}
            onClick={restartBookingProcess}
          >
            Go Back
          </VButton>
        </div>
      );
    }

    const loadingComponent = (
      <div className={styles.loadingWrapper}>
        <i className={`fa fa-spinner fa-spin fa-3x fa-fw ${styles.loadingSpinnerIcon}`} />
      </div>
    );

    const showTimer = !(isSuccessfulBooking || isTimerExpired);

    const PatientAvatar = () =>
      <Avatar user={patientUser} className={styles.avatar} onClick={() => this.ddMenu.toggle()} />;

    const avatarComponent = () => (
      <DropdownMenu labelComponent={PatientAvatar} ref={(ddMenu) => { this.ddMenu = ddMenu; }}>
        <MenuItem icon="power-off" onClick={() => this.logout()}>Sign Out</MenuItem>
      </DropdownMenu>
    );

    let classes = styles.submitViewWrapper;
    if (this.state.loading) {
      classes = classNames(classes, styles.fullHeight);
    }

    return (
      <div className={classes}>
        {showTimer ? (
          <div className={styles.timerWrapper}>
            <Timer
              className={styles.signup__header_timer}
              totalSeconds={TOTAL_SECONDS_ALLOWED}
              color={bookingWidgetPrimaryColor}
              onEnd={() => setIsTimerExpired(true)}
            />
          </div>
        ) : null}
        {/*patientUser ? (
            <div className={styles.avatarWrapper}>
              <div className={styles['user-component']}>
                {avatarComponent()}
              </div>
            </div>
          ) : null*/}
        { !this.state.loading ?
          <div className={styles.formWrapper}>
            { (!isSuccessfulBooking && patientUser && !isConfirming) ? (
                <div style={{textAlign: 'center'}}>
                  <div className={styles.messageWrapper}>
                <span>You are currently logged in as <strong>{patientUser.getFullName()}</strong>.
                  <br /><br />
                  If this is not you, and you would like to logout
                  and signin/signup as another user,
                  click <a href="#logout" onClick={(e) => {
                    e.preventDefault();
                    this.logout();
                  }}>here</a>.
                  <br /><br /> If it is you and you would
                  like to complete the booking, click the button below.
                </span>
                  </div>
                  <VButton className={styles.exitButton} onClick={() => this.props.createRequest()}>
                    Book This Appointment
                  </VButton>
                </div>
              ) : formComponent }
          </div> : loadingComponent }
      </div>
    );
  }
}

SubmitView.propTypes = {
  createPatient: PropTypes.func.isRequired,
  confirmCode: PropTypes.func.isRequired,
  createRequest: PropTypes.func.isRequired,
  createWaitSpot: PropTypes.func.isRequired,
  loginPatient: PropTypes.func.isRequired,
  setPatientUser: PropTypes.func.isRequired,
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
  patientUser: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
  }),

  hasWaitList: PropTypes.bool.isRequired,
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
    setPatientUser: Actions.setPatientUser,
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
