import React, { PropTypes } from 'react';
import moment from 'moment';
import includes from 'lodash/includes';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Button, Form, Field, Checkbox } from '../library';
import SignUp from './SignUp';
import Preferences from './Preferences';
import 'react-day-picker/lib/style.css';
import styles from './styles.scss';

class Availabilities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      modalIsOpen: false,
      practitionersStartEndDate: {},
      checked: false,
    };
    this.onDoctorChange = this.onDoctorChange.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.sixDaysBack = this.sixDaysBack.bind(this);
    this.sixDaysForward = this.sixDaysForward.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isDaySelected = this.isDaySelected.bind(this);
    this.selectAvailability = this.selectAvailability.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }


  onDoctorChange(e) {
    const {setPractitioner} = this.props;
    setPractitioner({practitionerId: e.target.value});
  }

  onServiceChange(e) {
    const {setService, practitionersStartEndDate} = this.props;
    const practitionerId = practitionersStartEndDate.toJS().practitionerId;
    setService(e.target.value)
  }

  sixDaysBack() {
    const {sixDaysShift, practitionersStartEndDate} = this.props;
    const practitionerId = practitionersStartEndDate.toJS().practitionerId;
    const selectedOldStartDay = practitionersStartEndDate.toJS()[practitionerId].selectedStartDay;
    const newEndDay = moment(selectedOldStartDay)._d;
    const newStartDay = moment(newEndDay).subtract(4, 'd')._d;

    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId,
      retrievedFirstTime: false,
    });

  }

  sixDaysForward() {
    const {sixDaysShift, practitionersStartEndDate} = this.props;
    const practitionerId = practitionersStartEndDate.toJS().practitionerId;
    const selectedOldStartDay = practitionersStartEndDate.toJS()[practitionerId].selectedStartDay;
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

    const {practitionersStartEndDate} = this.props;
    const {sixDaysShift} = this.props;
    const practitionerId = practitionersStartEndDate.toJS().practitionerId;
    const selectedOldStartDay = practitionersStartEndDate.toJS()[practitionerId].selectedStartDay;
    const newStartDay = day;
    const newEndDay = moment(newStartDay).add(4, 'd')._d;
    sixDaysShift({
      selectedStartDay: newStartDay,
      selectedEndDay: newEndDay,
      practitionerId,
      retrievedFirstTime: false,
    });

  }

  selectAvailability(slot) {
    if (!slot.isBusy) {
      const {startsAt} = slot;
      this.props.setStartingAppointmentTime(startsAt);
    }
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

  handleChange() {
    this.setState({
      checked: !this.state.checked
    })
  }
  handleSaveClick(e) {
    e.preventDefault();
    const { setRegistrationStep } = this.props;
    setRegistrationStep(2);
  }
  renderFirstStep({practitionerId, services, availabilities, practitioners, defaultValues}) {
    const startsAt = this.props.practitionersStartEndDate.get('startsAt');
    const preferences = this.state.checked
      ?
      <Preferences startsAt={startsAt } setRegistrationStep={this.props.setRegistrationStep}/>
      : null;
    const { logo } = this.props;
    return (
      <div className={styles.appointment}>
        <div className={styles.appointment__wrapper}>
          <div className={styles.appointment__sidebar}>
            <div className={styles.sidebar__header}>
              <img className={styles.sidebar__header_logo} src={logo} alt="logo"/>
              <div className={styles.sidebar__header_title}>
                Pacific Heart
                <span>Dental</span>
              </div>
            </div>
            <div className={styles.sidebar__body}>
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
            </div>
            <div className={styles.sidebar__footer}>
              <div className={styles.sidebar__footer_copy}>
                <div>POWERED BY:</div>
                <img src="/images/logo_black.png" alt="logo"/>
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
                <Form className={styles.appointment__select_wrapper} form="availabilities"
                      initialValues={defaultValues}>
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
                          <li onClick={() => {
                            this.selectAvailability(slot)
                          }}
                              className={`${styles.appointment__list_item} ${slot.isBusy ? styles.appointment__list_active : ''} ${slot.startsAt === startsAt ? styles.appointment__list_selected: '' }`}
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
                <div className={styles.appointment__footer_wrapper}>
                  <div className={styles.appointment__footer_title}>
                    BE NOTIFIED IF AN EARLIER TIME BECOMES AVAILABLE?
                  </div>
                  <form className={styles.appointment__footer_confirm}>
                    <div className={styles.appointment__footer_select}>
                      <Checkbox id="yes"
                                value="yes"
                                checked={ this.state.checked }
                                onChange={ this.handleChange }/>
                    </div>
                    <button disabled={!startsAt}
                            onClick={this.handleSaveClick}
                            className={this.state.checked ? styles.appointment__footer_btndisabled : styles.appointment__footer_btn }
                            type="submit">Continue</button>
                  </form>
                </div>
                {preferences}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getAppointmentInfo(serviceId) {
    const { practitionersStartEndDate, practitioners, services, practitionerId } = this.props;
    const selectedService = services.filter(s => s.id === serviceId)[0];
    const selectedPractitioner = practitioners.filter(p => p.id === practitionerId)[0];
    if (selectedPractitioner && selectedService) {
      const { firstName, lastName } = selectedPractitioner;
      const { name } = selectedService; 
      const date = moment(practitionersStartEndDate.toJS().startsAt).format('LLLL');
      return `${name} Dr ${lastName} ${date} ` 
    }
    return null
  }

  render() {
    const {
      services,
      practitioners,
      availabilities,
      practitionerId,
      createPatient,
      practitionersStartEndDate,
      setRegistrationStep,
      logo,
    } = this.props;

    const serviceId = this.props.serviceId || services[0] && services[0].id;
    const prId = practitioners[0] && practitioners.id;
    const defaultValues = { practitionerId, serviceId };
    const params = { practitionerId, services, availabilities, practitioners, defaultValues };

    const appointmentInfo = this.getAppointmentInfo(serviceId);

    switch (practitionersStartEndDate.get('registrationStep')) {
      case 1:
        return this.renderFirstStep(params);
      case 2:
        return <SignUp
          setRegistrationStep={setRegistrationStep}
          createPatient={createPatient}
          practitionersStartEndDate={practitionersStartEndDate}
          logo={logo}
          appointmentInfo={appointmentInfo}
        />;
      case undefined:
        return (
          <div>Loading..</div>
        );
    }
  }
}


export default Availabilities;
