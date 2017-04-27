
import React, { Component } from 'react';
import Timer from '../Timer';
import SignUpForm from './SignUpForm';
import styles from './styles.scss';

class SubmitView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 3 * 60 * 1000,
      maxtime: 3 * 60 * 1000,
      collapseMenu: false,
    };

    this.registrationTimer = null;
    this.startTimer = this.startTimer.bind(this);
    this.getPercent = this.getPercent.bind(this);
    this.bookAnAppointment = this.bookAnAppointment.bind(this);
    this.setRegistrationStep = this.setRegistrationStep.bind(this);
    this.collapseMenu = this.collapseMenu.bind(this);
  }

  componentDidMount() {
    this.startTimer();
  }

  getPercent() {
    return 100 - ((this.state.maxtime - this.state.time) / this.state.maxtime * 100);
  }

  startTimer() {
    this.registrationTimer = setInterval((() => {
      this.setState({
        time: this.state.time - 1000,
      });
      if (this.getPercent() === 0) {
        const { reservationId } = this.props.practitionersStartEndDate.toJS();
        this.props.removeReservation(reservationId);
        clearInterval(this.registrationTimer);
      }
    }).bind(this), 1000);
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

  collapseMenu(open) {
    if(open) {
      this.setState({
        collapseMenu: true,
      });
    } else {
      this.setState({
        collapseMenu: false,
      });
    }
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

  render() {
    const { practitionersStartEndDate, logo, address, appointmentInfo } = this.props;
    const { messages } = practitionersStartEndDate.toJS();
    const contnet = messages.length ? this.renderMessages(messages)
      : <SignUpForm onSubmit={values => alert(JSON.stringify(values))} />;
    return (
      <div className={styles.submitViewWrapper}>
        <Timer
          className={styles.signup__header_timer}
          seconds={this.state.time}
          percentage={this.getPercent()}
          color={this.props.bookingWidgetPrimaryColor}
        />
        <div onClick={() => this.collapseMenu(false)} className={styles.formWrapper}>
          {contnet}
        </div>
        <div className={styles.signup__footer}>
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
        </div>
      </div>
    );
  }
}


export default SubmitView;
