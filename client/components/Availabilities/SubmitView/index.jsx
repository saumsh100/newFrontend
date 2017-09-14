
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
import * as AuthThunks from '../../../thunks/patientAuth';
import styles from './styles.scss';

const TOTAL_SECONDS_ALLOWED = 3 * 60;

class SubmitView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.signUpAndConfirm = this.signUpAndConfirm.bind(this);
    this.confirmAndBook = this.confirmAndBook.bind(this);
    this.resendPinCode = this.resendPinCode.bind(this);
    this.createRequest = this.createRequest.bind(this);
  }

  login(credentials) {
    return this.props.login(credentials)
      .then(() => {
        console.log('Login Successful, Check State');
      })
      .catch(({ data, status }) => {
        throw new SubmissionError({
          email: data,
          password: data,
        });
      });
  }

  logout() {
    return this.props.logout();
  }

  confirmAndBook(values) {
    // TODO: createPatient.then(createRequest).then(setSuccessful)
    // alert(JSON.stringify(values));
    return this.props.confirmCode(values)
      .then(() => {
        this.createRequest();
      })
      .catch(() => {
        throw new SubmissionError({ confirmCode: 'Invalid code' });
      });
  }

  createRequest() {
    this.props.hasWaitList && this.props.createWaitSpot();
    this.props.createRequest();
  }

  signUpAndConfirm(values) {
    // TODO: createPatient.then(createRequest).then(setSuccessful)
    // alert(JSON.stringify(values));
    this.setState({ loading: true });
    this.props.createPatient(values)
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

  resendPinCode() {
    this.props.resendPinCode();
  }

  render() {
    const {
      resendPinCode,
    } = this;

    const {
      isAuthenticated,
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
      initialValues,
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
        <SignUpForm onSubmit={this.signUpAndConfirm} initialValues={initialValues}/>
        <div className={styles.alreadyHaveWrapper}>
          Already have an account? {loginHereAnchor}
        </div>
      </div>
    );

    if (patientUser && !patientUser.get('isPhoneNumberConfirmed')) {
      const resendAnchor = (
        <a
          href="#resend"
          onClick={(e) => { e.preventDefault(); resendPinCode(); }}
        >
          here
        </a>
      );


      formComponent = (
        <div>
          <div className={styles.messageWrapper}>
          <span>You are currently logged in as <strong>{patientUser.getFullName()}</strong>.
            <br /><br />
            If this is not you, and you would like to logout
            and signin/signup as another user,
            click <a href="#logout" onClick={(e) => {
              e.preventDefault();
              this.logout();
            }}>here</a>.
            <br /><br />
          </span>
            We have sent a confirmation code via SMS to {patientUser.get('phoneNumber')}.
            Please type in the code below and submit to complete your booking.
            If you did not receive your SMS and want it sent again, click {resendAnchor}.
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

      const forgotPasswordAnchor = (
        <a
          href="#forgotpassword"
          onClick{()=>{ e.preventDefault();}}
          >
          Click here
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
          <div>
            Forgot your password? {forgotPasswordAnchor}
          </div>
        </div>
      );
    }

    if (isSuccessfulBooking) {
      formComponent = (
        <div>
          <div className={styles.messageWrapper}>
            <span>
              Congratulations! You have successfully <strong>requested</strong> your appointment.
            </span>
            <br/><br/>
            <span>
              <strong>Wait</strong> for the clinic to confirm your appointment details.
            </span>
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
            { (!isSuccessfulBooking && !isTimerExpired && patientUser && patientUser.get('isPhoneNumberConfirmed')) ? (
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
                  <VButton className={styles.exitButton} onClick={() => this.createRequest()}>
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
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  resendPinCode: PropTypes.func.isRequired,
  setPatientUser: PropTypes.func.isRequired,
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
  initialValues: PropTypes.object,

  hasWaitList: PropTypes.bool.isRequired,
};

function mapStateToProps({ availabilities, auth }) {
  return {
    isConfirming: availabilities.get('isConfirming'),
    isLogin: availabilities.get('isLogin'),
    isTimerExpired: availabilities.get('isTimerExpired'),
    isSuccessfulBooking: availabilities.get('isSuccessfulBooking'),
    patientUser: auth.get('patientUser'),
    isAuthenticated: auth.get('isAuthenticated'),
    hasWaitList: availabilities.get('hasWaitList'),

    // TODO: shouldn't have to go to Redux to grab this...
    bookingWidgetPrimaryColor: availabilities.getIn(['account', 'bookingWidgetPrimaryColor']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    login: AuthThunks.login,
    logout: AuthThunks.logout,
    createPatient: AuthThunks.createPatient,
    setPatientUser: Actions.setPatientUser,
    confirmCode: Thunks.confirmCode,
    createRequest: Thunks.createRequest,
    createWaitSpot: Thunks.createWaitSpot,
    resendPinCode: Thunks.resendPinCode,
    restartBookingProcess: Thunks.restartBookingProcess,
    setIsConfirming: Actions.setIsConfirming,
    setIsLogin: Actions.setIsLogin,
    setIsTimerExpired: Actions.setIsTimerExpired,
    closeBookingModal: Thunks.closeBookingModal,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitView);
