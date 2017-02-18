import React, {PropTypes, Component} from 'react';
import Timer from './Timer'
import styles from './SignUp.scss';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      maxtime: 3 * 60 * 1000,
    };
    this.registrationTime = null;
    this.startTimer = this.startTimer.bind(this);
    this.getPercent = this.getPercent.bind(this);
  }

  componentDidMount() {
    this.startTimer()
  }

  startTimer() {
    this.registrationTime = setInterval(() => {
      this.setState({
        time: this.state.time + 1000
      });
      if (this.getPercent() == 100) clearInterval(this.registrationTime);
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
              <Timer className={styles.signup__header_timer} percentage={this.getPercent()}/>
            </div>
            <div className={styles.signup__body}>
              <form className={styles.signup__body_confirm}>
                <input
                  className={styles.signup__body_input}
                  type="text"
                  name="firstname"
                  placeholder="First Name *"
                />
                <input
                  className={styles.signup__body_input}
                  type="text"
                  name="lastname"
                  placeholder="Last Name *"
                />
                <input
                  className={styles.signup__body_input}
                  type="text"
                  name="phone"
                  placeholder="Phone Number *"
                />
                <input
                  className={styles.signup__body_input}
                  type="email"
                  name="email"
                  placeholder="Email *"
                />
                <input
                  className={styles.signup__body_input}
                  type="text"
                  name="password"
                  placeholder="Password *"
                />
                <input
                  className={styles.signup__body_input}
                  type="text"
                  name="password"
                  placeholder="Confirm Password *"
                />
                <input onClick={this.saveAndContinue}
                       className={styles.signup__footer_btn}
                       type="submit"
                       value="BOOK THIS APPOINTMENT"/>
              </form>
            </div>
            <div className={styles.signup__footer}>
              <div className={styles.signup__footer_header}>
                <div className={styles.signup__footer_title}>
                  ALREADY HAVE AN ACCOUNT?
                </div>
                <a className={styles.signup__footer_login} href="/login">Login here</a>
              </div>
              <a className={styles.signup__footer_facebook}>
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
