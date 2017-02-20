import React, {PropTypes, Component} from 'react';
import Timer from './Timer'
import styles from './SignUp.scss';

import { Button, Form, Field } from '../library';

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
  }

  componentDidMount() {
    this.startTimer()
  }

  startTimer() {
    this.registrationTimer = setInterval(() => {
      this.setState({
        time: this.state.time + 1000
      });
      if (this.getPercent() == 100) clearInterval(this.registrationTimer);
    }, 1000);
  }

  getPercent() {
    return 100 - ((this.state.maxtime - this.state.time) / this.state.maxtime * 100);
  }


  render() {
    return (
      <div className={styles.signup}>
        <div className={styles.signup__wrapper}>
          <div className={styles.signup__sidebar}>
          </div>
          <div className={styles.signup__main}>
            <div className={styles.signup__header}>
              <div className={styles.signup__header_title}>
                SIGN UP
              </div>
              <Timer className={styles.signup__header_timer}
                     seconds={this.state.time}
                     percentage={this.getPercent()}/>
            </div>
            <div className={styles.signup__body}>
              
              <Form form="availabilitiesRequest" className={styles.signup__body_confirm}>
                <Field
                  name="firstname"
                  placeholder="First Name *"
                  className={styles.signup__body_input}
                  min
                />
                <Field
                  name="lastname"
                  placeholder="Last Name *"
                  className={styles.signup__body_input}
                  min
                />
                <Field
                  placeholder="Phone Number *"
                  name="phone"
                  className={styles.signup__body_input}
                  min
                />
                <Field
                  className={styles.signup__body_input}
                  placeholder="Email *"
                  name="email"                  
                  min
                />

                <Field
                  className={styles.signup__body_input}
                  placeholder="Password *"
                  name="password"
                  min           
                />
                <Field
                  className={styles.signup__body_input}
                  placeholder="Confirm Password *"
                  name="confirmPassword"              
                />
              </Form>
            </div>
            <div className={styles.signup__footer}>
              <div className={styles.signup__footer_header}>
                <div className={styles.signup__footer_title}>
                  ALREADY HAVE AN ACCOUNT?
                </div>
                <a className={styles.signup__footer_login} href="/login">Login here</a>
              </div>
              <a href="//www.facebook.com/" className={styles.signup__footer_facebook}>
                <span className="fa fa-facebook-official"/>
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
    )
  }
}


export default SignUp;
