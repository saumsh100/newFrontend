import React, { Component } from 'react';
import Timer from './Timer';
import styles from './SignUp.scss';

import { formWithCustomValidation } from '../library/Form';

import { Button, Form, Field } from '../library';
import validate from '../library/Form/validate';


const FormWithCustomValidation = formWithCustomValidation(validate)

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      maxtime: 3 * 60 * 1000,
    };
    this.registrationTimer = null;
    this.startTimer = this.startTimer.bind(this);
    this.getPercent = this.getPercent.bind(this);
    this.bookAnAppointment = this.bookAnAppointment.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.renderBookingForm = this.renderBookingForm.bind(this);
  }


  componentDidMount() {
    this.startTimer();
  }

  getPercent() {
    return 100 - ((this.state.maxtime - this.state.time) / this.state.maxtime * 100);
  }

  startTimer() {
    this.registrationTimer = setInterval(() => {
      this.setState({
        time: this.state.time + 1000,
      });
      if (this.getPercent() === 100) clearInterval(this.registrationTimer);
    }, 1000);
  }

  bookAnAppointment(params) {
    const { startsAt, practitionerId, serviceId } = this.props.practitonersStartEndDate.toJS();
    const paramsToPass = Object.assign({ startsAt, practitionerId, serviceId }, params);
    this.props.createPatient(paramsToPass);
  }

  handleSaveClick(e) {
    e.preventDefault();
    const { setRegistrationStep } = this.props;
    setRegistrationStep(1);
  }
  renderBookingForm() {
    return (
      <FormWithCustomValidation
            form="availabilitiesRequest"
            className={styles.signup__body_confirm}
            onSubmit={this.bookAnAppointment}
      >
        <Field
          name="firstName"
          label="First Name *"
          className={styles.signup__body_input}
        />
        <Field
          name="lastName"
          label="Last Name *"
          className={styles.signup__body_input}
        />
        <Field
          label="Phone Number *"
          name="phone"
          className={styles.signup__body_input}
        />
        <Field
          className={styles.signup__body_input}
          label="Email *"
          name="email"
          type="email"
        />

        <Field
          className={styles.signup__body_input}
          label="Password *"
          name="password"
        />
        <Field
          className={styles.signup__body_input}
          label="Confirm Password *"
          name="confirmPassword"
        />
        <Button
          type="submit"
          className={styles.signup__footer_btn}>
          Book an appointment
        </Button>
      </FormWithCustomValidation>
    );
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
    const { practitonersStartEndDate } = this.props;
    const { messages } = practitonersStartEndDate.toJS();
    const contnet = messages.length ? this.renderMessages(messages)
      : this.renderBookingForm()
    return (
      <div className={styles.signup}>
        <div className={styles.signup__wrapper}>
          <div className={styles.signup__sidebar}>
            <div className={styles.sidebar__header}>
              <div className={styles.sidebar__header_title}>
                You brooked
              </div>
            </div>
            <div className={styles.sidebar__main}>
              <div className={styles.sidebar__body}>
                <div className={styles.sidebar__body_service}>
                  <ul>
                    <li>SERVICE: <span>Toothache</span></li>
                    <li>WITH: <span>Dr. Chelsea</span></li>
                    <li>AT: <span>Feb 13 2017</span></li>
                  </ul>
                </div>
                <div className={styles.sidebar__body_address}>
                  <div className={styles.sidebar__address}>
                    <div className={styles.sidebar__address_title}>
                      PACIFIC HEART DENTAL
                    </div>
                    <div className={styles.sidebar__address_text}>
                      194-105 East 3rd
                      7 ave
                      Vancouver, BC
                      Canda V1B 2C3
                    </div>
                  </div>
                </div>
                <div className={styles.sidebar__body_map}>
                </div>
              </div>
              <div className={styles.sidebar__footer}>
                <button onClick={this.handleSaveClick} className={styles.sidebar__footer_btn}>GO BACK</button>
                <div className={styles.sidebar__footer_additional}>
                  <div className={styles.sidebar__footer_title}>ADDITIONAL INFO</div>
                  <ul className={styles.sidebar__footer_list}>
                    <li>This clinic accpets all major
                      insuranc
                    </li>
                    <li>Approximate appointment
                      length is 120 min
                    </li>
                  </ul>
                </div>
                <div className={styles.sidebar__footer_copy}>
                  <span>POWERED BY:</span>
                  <img src="/images/carecru_logo.png" alt="logo" />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.signup__main}>
            <div className={styles.signup__header}>
              <div className={styles.signup__header_title}>
                SIGN UP
              </div>
              <Timer className={styles.signup__header_timer}
                     seconds={this.state.time}
                     percentage={this.getPercent()}
              />
            </div>
            <div className={styles.signup__body}>
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
              <div className={styles.signup__footer_pagination}>
                <ul>
                  <li>
                    <div>1</div>
                  </li>
                  <li>
                    <div>2</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default SignUp;
