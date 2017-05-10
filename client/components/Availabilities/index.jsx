
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { DateUtils } from 'react-day-picker';
import SelectionView from './SelectionView';
import SubmitView from './SubmitView';
import SideBar from './SideBar';
import Header from './Header';
import styles from './styles.scss';

class Availabilities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      modalIsOpen: false,
      practitionersStartEndDate: {},
      checked: false,
    };

    this.handleDayClick = this.handleDayClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isDaySelected = this.isDaySelected.bind(this);
    this.selectAvailability = this.selectAvailability.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.closeIframe = this.closeIframe.bind(this);
  }

  componentWillReceiveProps() {
    const color = this.props.account.get('bookingWidgetPrimaryColor') || '#ff715a';
    document.body.style.setProperty('--bookingWidgetPrimaryColor', color);
  }

  handleDayClick(e, day) {
    const { practitionersStartEndDate } = this.props;
    const { sixDaysShift } = this.props;
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

  selectAvailability() {
    const newAvailability = {
      startDate: new Date(2017, i++, i * 2, 8, 0),
      endDate: new Date(2017, i++, i * 2, 9, 0),
    };

    this.props.setSelectedAvailability(newAvailability);
  }

  isDaySelected(day) {
    return DateUtils.isSameDay(day, this.state.selectedStartDay);
  }

  openModal() {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  }

  closeModal() {
    this.setState({ modalIsOpen: !modalIsOpen });
  }

  handleChange() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  handleSaveClick(e) {
    e.preventDefault();
    const { setRegistrationStep } = this.props;
    const array = location.pathname.split('/');
    const accountId = array[array.length - 1];
    setRegistrationStep(2, accountId);
  }

  closeIframe() {
    window.parent.postMessage('message', '*');
  }

  getAppointmentInfo(serviceId) {
    const { practitionersStartEndDate, practitioners, services, practitionerId } = this.props;
    const selectedService = services.get(serviceId);
    const selectedPractitioner = practitioners.get(practitionerId);
    if (selectedPractitioner && selectedService) {
      const { firstName, lastName } = selectedPractitioner;
      const { name } = selectedService;
      const date = moment(practitionersStartEndDate.toJS().startsAt).format('LLLL');
      return `${name} Dr ${lastName} ${date} `;
    }

    return null;
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
      account,
      removeReservation,
    } = this.props;

    const serviceId = this.props.serviceId;
    const prId = this.props.practitionerId;
    const defaultValues = { practitionerId, serviceId };
    const appointmentInfo = this.getAppointmentInfo(serviceId);
    const registrationStep = practitionersStartEndDate.get('registrationStep');

    let currentView = (
      <SelectionView />
    );

    if (registrationStep === 2) {
      currentView = (
        <SubmitView
          setRegistrationStep={setRegistrationStep}
          createPatient={createPatient}
          practitionersStartEndDate={practitionersStartEndDate}
          account={account}
          appointmentInfo={appointmentInfo}
          removeReservation={removeReservation}
        />
      );
    }

    return (
      <div className={styles.signup}>
        <div className={styles.signup__wrapper}>
          <SideBar account={account} />
          <div className={styles.appointment__main}>
            <Header />
            {currentView}
          </div>
        </div>
      </div>
    );
  }
}

export default Availabilities;
