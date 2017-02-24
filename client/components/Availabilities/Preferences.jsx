import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import styles from './Preferences.scss';

class Preferences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      modalIsOpen: false,
      practitionersStartEndDate: {},
      checked: false,
    };
    this.openModal = this.openModal.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  }
  handleSaveClick(e) {
    e.preventDefault();
    const { setRegistrationStep } = this.props;
    setRegistrationStep(2);
  }
  render() {
    return (
      <div className={styles.appointment__footer_preferences}>
        <div className={styles.appointment__preferences}>
          <div className={styles.appointment__preferences_left}>
            <div className={styles.appointment__preferences_title}>
              PREFERENCES
            </div>
            <div className={styles.appointment__preferences_checkbox}>
              <label>
                <input type="checkbox" name="day" id="morning" value="morning"/>Morning
              </label>
              <label>
                <input type="checkbox" name="day" id="afternoon" value="afternoon"/>Afternoon
              </label>
              <label>
                <input type="checkbox" name="day" id="evenings" value="evenings"/>Evenings
              </label>
              <label>
                <input type="checkbox" name="day" id="weekdays" value="weekdays"/>Weekdays
              </label>
              <label>
                <input type="checkbox" name="day" id="weekends" value="weekends"/>Weekends
              </label>
            </div>
          </div>
          <div className={styles.appointment__preferences_right}>
            <div className={styles.appointment__daypicker}>
              <div className={styles.appointment__preferences_title}>Appointment scheduler</div>
              <div onClick={this.openModal}
                   className={styles.appointment__daypicker_icon}>
                <i className="fa fa-calendar"/>
              </div>
              {this.state.modalIsOpen ?
                (
                  <div onClick={this.openModal} className={styles.appointment__daypicker_modal}>
                    <DayPicker
                      className={styles.appointment__daypicker_select}
                      onDayClick={ this.handleDayClick }
                      selectedDays={ this.isDaySelected }/>
                  </div>
                ) : null
              }
            </div>
            <button disabled={!this.props.startsAt} onClick={this.handleSaveClick} className={styles.appointment__preferences_btn} type="submit">Continue</button>
          </div>
        </div>
      </div>
    );
  }
}





export default Preferences;