import React, {PropTypes} from 'react';
import moment from 'moment';
import styles from './styles.scss';
import includes from 'lodash/includes';
import DayPicker, {DateUtils} from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import SignUp from './SignUp'
import {Button, Form, Field} from '../library';


class Availabilities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      modalIsOpen: false,
      practitonersStartEndDate: {},
      step: 1,
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.sixDaysBack = this.sixDaysBack.bind(this);
    this.sixDaysForward = this.sixDaysForward.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isDaySelected = this.isDaySelected.bind(this)
    this.saveAndContinue = this.saveAndContinue.bind(this)
  }


  onDoctorChange(e) {
    const {setPractitioner} = this.props;
    setPractitioner({practitionerId: e.target.value});
  }

  onServiceChange(e) {
    const {setService, practitonersStartEndDate} = this.props;
    const practitionerId = practitonersStartEndDate.toJS().practitionerId;
    setService(e.target.value)
  }

  sixDaysBack() {
    const {sixDaysShift, practitonersStartEndDate} = this.props;
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
    const {sixDaysShift, practitonersStartEndDate} = this.props;
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

    const {practitonersStartEndDate} = this.props;
    const {sixDaysShift} = this.props;
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

  saveAndContinue(e) {
    e.preventDefault();
    this.setState({step: 2});
    console.log('Click handled')
  }

  renderFirstStep({practitionerId, services, availabilities, practitioners, defaultValues}) {
    return (
      <div className={styles.appointment}>
        <div className={styles.appointment__wrapper}>
          <div className={styles.appointment__sidebar}>
            <div className={styles.sidebar__header}>
              <img className={styles.sidebar__header_logo} src="images/availabilies_sidebar_logo_2.png" alt="logo"/>
              <div className={styles.sidebar__header_title}>
                Pacific Heart
                <span>Dental</span>
              </div>
            </div>
            <div className={styles.sidebar__body}>
              <div className={styles.sidebar__body_practitioner}>
                <img className={styles.practitioner__img} src="images/practitioner_1.png" alt="doctor">
                </img>
                <div className={styles.practitioner__name}>
                  Dr. Chelsea
                </div>
                <div className={styles.practitioner__descr}>
                  <span>Dr. Chelsea</span>
                  lorem Ipsum is
                  simply dummy text of the
                  printing and typesetting
                  industry. Lorem
                </div>
              </div>
              <div className={styles.sidebar__body_map}>
              </div>
            </div>
            <div className={styles.sidebar__footer}>
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
                <img src="/images/carecru_logo.png" alt="logo"/>
              </div>
            </div>
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
                  {defaultValues && defaultValues.practitionerId &&
                  <Form className={styles.appointment__select_wrapper} form="availabilities" initialValues={defaultValues}>
                    <Field
                      component="Select"
                      name="practitionerId"
                      label="Select Practitioner"
                      min
                      className={styles.appointment__select_item}
                    >
                      {practitioners.map(p =>
                        <option value={p.id} key={p.id}>{p.getFullName()}</option>
                      )}
                    </Field>

                    <Field
                      component="Select"
                      className={styles.appointment__select_item}
                      name="serviceId"
                      label="Select Service"
                      min
                    >
                      {services.filter(s =>
                        includes(s.allowedPractitioners, practitionerId)
                      ).map(s =>
                        <option value={s.id} key={s.id}>{s.name}</option>
                      )}
                    </Field>
                  </Form>}
                <div className={styles.appointment__daypicker}>
                  <div className={styles.appointment__daypicker_title}>Appointment scheduler</div>
                  <div onClick={this.openModal}
                       className={styles.appointment__daypicker_icon}>
                    <div className={styles.appointment__daypicker_date}>
                      {moment(this.state.selectedStartDay).format('DD MM YYYY')}
                    </div>
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
                          <li
                            className={`${styles.appointment__list_item} ${slot.isBusy ? styles.appointment__list_active : ''}`}
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
                  <input onClick={this.saveAndContinue} className={styles.appointment__footer_btn} type="submit"
                         value="Continue"/>
                </form>
                <div className={styles.appointment__footer_pagination}>
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
      </div>
    );
  }

  render() {
    const {
      services,
      practitioners,
      availabilities,
      practitionerId,
    } = this.props;

    const serviceId = services[0] && services[0].id;
    const prId = practitioners[0] && practitioners.id;
    const defaultValues = {practitionerId, serviceId};
    const params = {practitionerId, services, availabilities, practitioners, defaultValues}
    switch (this.state.step) {
      case 1:
        return this.renderFirstStep(params)
      case 2:
        return <SignUp />
    }
  }
}


export default Availabilities;
