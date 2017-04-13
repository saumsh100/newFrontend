
import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Checkbox } from '../../../library';
import 'react-day-picker/lib/style.css';
import styles from './styles.scss';

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
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
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
              <div>
                <Checkbox id="morning" value="morning" label="Morning"/>
                <Checkbox id="afternoon" value="afternoon" label="Afternoon"/>
                <Checkbox id="evenings" value="evenings" label="Evenings"/>
              </div>
              <div>
                <Checkbox id="weekdays" value="weekdays" label="Weekdays"/>
                <Checkbox id="weekends" value="weekends" label="Weekends"/>
              </div>
            </div>
          </div>
          <div className={styles.appointment__preferences_right}>
            <div className={styles.appointment__daypicker}>
              <div className={styles.appointment__preferences_title}>
                Appointment scheduler
                <div onClick={this.openModal}
                     className={styles.appointment__daypicker_icon}>
                  <i className="fa fa-calendar"/>
                </div>
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
