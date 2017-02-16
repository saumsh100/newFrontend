
import React, { PropTypes } from 'react';
import moment from 'moment';
import styles from './styles.scss';
import includes from 'lodash/includes';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
class Availabilities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      modalIsOpen: false,
      practitonersStartEndDate: {},
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.sixDaysBack = this.sixDaysBack.bind(this);
    this.sixDaysForward = this.sixDaysForward.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isDaySelected = this.isDaySelected.bind(this)
  }


  onDoctorChange(e) {
    const { setPractitioner } = this.props;
    setPractitioner({ practitionerId : e.target.value });
  }

  onServiceChange(e) {
    const { setService, practitonersStartEndDate } = this.props;
    const practitionerId = practitonersStartEndDate.toJS().practitionerId;
    setService(e.target.value)
  }

  sixDaysBack() {
    const { sixDaysShift, practitonersStartEndDate } = this.props;
    const practitionerId = practitonersStartEndDate.toJS().practitionerId;
    const selectedOldStartDay = practitonersStartEndDate.toJS()[practitionerId].selectedStartDay;
    const newEndDay = moment(selectedOldStartDay)._d
    const newStartDay = moment(newEndDay).subtract(4, 'd')._d;

    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId,
      retrievedFirstTime: false,
    });

  }

  sixDaysForward() {
    const { sixDaysShift, practitonersStartEndDate } = this.props;
    const practitionerId = practitonersStartEndDate.toJS().practitionerId;
    const selectedOldStartDay = practitonersStartEndDate.toJS()[practitionerId].selectedStartDay;
    const newStartDay = moment(selectedOldStartDay).add(4, 'd')._d;
    const newEndDay = moment(newStartDay).add(4, 'd')._d;

    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId,
      retrievedFirstTime: false,
    });

  }

  handleDayClick(e, day) {

    const { practitonersStartEndDate } = this.props;
    const { sixDaysShift } = this.props;
    const practitionerId = practitonersStartEndDate.toJS().practitionerId;
    const selectedOldStartDay = practitonersStartEndDate.toJS()[practitionerId].selectedStartDay;
    const newStartDay = day;
    const newEndDay = moment(newStartDay).add(4, 'd')._d;
    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId,
      retrievedFirstTime: false,     
    });

  }

  isDaySelected(day) {
    return DateUtils.isSameDay(day, this.state.selectedStartDay);
  }

  openModal() {
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  }

  closeModal() {
    this.setState({modalIsOpen: !modalIsOpen});
  }


	render() {
		const {
			services,
			practitioners,
			availabilities,
			practitionerId,
		} = this.props;

    return (
      <div className={styles.appointment}>
        <div className={styles.appointment__wrapper}>
          <div className={styles.appointment__sidebar}>
          </div>
          <div className={styles.appointment__main}>
            <div className={styles.appointment__header}>
              <div className={styles.appointment__header_title}>
                BOOK APPOINTMENT
              </div>
            </div>
            <div className={styles.appointment__body}>
              <div className={styles.appointment__body_header}>
                <div className={styles.appointment__select_title}>Practitioner</div>
                <div className={styles.appointment__select_wrapper}>
                  <select
                    className={styles.appointment__select_item}
                    value={practitionerId}
                    onChange={this.onDoctorChange}
                    ref={(doctor) => { this.doctor = doctor; }}>
                    <option value="" selected>No Preference</option>
                    {practitioners.map(p =>
                      <option value={p.id} key={p.id}>{p.getFullName()}</option>
                    )}
                  </select>
                  <select
                    className={styles.appointment__select_item}
                    onChange={this.onServiceChange}
                    ref={(service) => { this.service = service; }}>
                    <option value="" selected>Service</option>
                    {services.filter(s =>
                      includes(s.practitioners, this.state.practitionerId)
                    ).map(s =>
                      <option value={s.id} key={s.id}>{s.name}</option>
                    )}
                  </select></div>
                <div className={styles.appointment__daypicker}>
                  <div className={styles.appointment__daypicker_title}>Appointment scheduler</div>
                  <div onClick={this.openModal}
                       className={styles.appointment__daypicker_icon}>
                    <div className={styles.appointment__daypicker_date}>
                      {moment(this.state.selectedStartDay).format('DD MM YYYY')}
                    </div>
                    <i className="fa fa-calendar" />
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
              </div>
              <div className={styles.appointment__table}>
                <button className={styles.appointment__table_btn} onClick={this.sixDaysBack}>
                  <i className="fa fa-arrow-circle-o-left"/>
                </button>
                <div className={styles.appointment__table_elements}>
                  {availabilities.map(av => {
                    return (
                      <ul className={styles.appointment__list} key={av.date}>
                        <div className={styles.appointment__list_header}>
                          <div className={styles.list__header_day}>
                            {moment(av.date).format('ddd')}
                          </div>
                          <div className={styles.list__header_number}>
                            {moment(av.date).format('DD/MM/YYYY')}
                          </div>
                        </div>
                        {av.availabilities.map(slot =>
                          <li className={`${styles.appointment__list_item} ${slot.isBusy ? styles.appointment__list_active : ''}`}
                              key={slot.startsAt}>
                            {moment(slot.startsAt).format('HH:mm A')}
                          </li>)
                        }
                      </ul>);
                  })}
                </div>
                <button className={styles.appointment__table_btn} onClick={this.sixDaysForward}>
                  <i className="fa fa-arrow-circle-o-right"/>
                </button>
              </div>
              <div className={styles.appointment__footer}>
                <div className={styles.appointment__footer_title}>
                  would you like to be informed if an earlier time becomes available?
                </div>
                <form className={styles.appointment__footer_confirm}>
                  <div className={styles.appointment__footer_select}>
                    <input type="radio" name="answer" id="yes" value="yes"/>
                    <label htmlFor="yes">Yes</label>
                    <input type="radio" name="answer" id="no" value="no"/>
                    <label htmlFor="no">No</label>
                  </div>
                  <input className={styles.appointment__footer_btn} type="submit" value="Continue"/>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
	}

}

export default Availabilities;
