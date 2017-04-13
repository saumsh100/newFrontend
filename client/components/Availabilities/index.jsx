
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { DateUtils } from 'react-day-picker';
import SignUp from './SignUp';
import SelectionView from './SelectionView';

class Availabilities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      modalIsOpen: false,
      practitionersStartEndDate: {},
      checked: false,
      collapseMenu: false,
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
    this.collapseMenu = this.collapseMenu.bind(this);
    this.closeIframe = this.closeIframe.bind(this);
  }

  componentWillReceiveProps() {
    document.body.style.setProperty('--bookingWidgetPrimaryColor', this.props.bookingWidgetPrimaryColor);
  }

  onDoctorChange(e) {
    const { setPractitioner } = this.props;
    setPractitioner({ practitionerId: e.target.value });
  }

  onServiceChange(e) {
    const { setService, practitionersStartEndDate } = this.props;
    const practitionerId = practitionersStartEndDate.toJS().practitionerId;
    setService(e.target.value);
  }

  sixDaysBack() {
    const { sixDaysShift, practitionersStartEndDate } = this.props;
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
    const { sixDaysShift, practitionersStartEndDate } = this.props;
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

  selectAvailability(slot) {
    if (!slot.isBusy) {
      const { startsAt } = slot;
      this.props.setStartingAppointmentTime(startsAt);
    }
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

  collapseMenu(open) {
    if (open) {
      this.setState({
        collapseMenu: true,
      });
    } else {
      this.setState({
        collapseMenu: false,
      });
    }
  }

  closeIframe() {
    window.parent.postMessage('message', '*');
  }

  getAppointmentInfo(serviceId) {
    const { practitionersStartEndDate, practitioners, services, practitionerId } = this.props;
    const selectedService = services.filter(s => s.id === serviceId)[0];
    const selectedPractitioner = practitioners.filter(p => p.id === practitionerId)[0];
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
      logo,
      address,
      removeReservation,
      bookingWidgetPrimaryColor,
    } = this.props;

    const serviceId = this.props.serviceId || services[0] && services[0].id;
    const prId = practitioners[0] && practitioners.id;
    const defaultValues = { practitionerId, serviceId };
    const params = { practitionerId, services, availabilities, practitioners, defaultValues };
    const appointmentInfo = this.getAppointmentInfo(serviceId);
    switch (practitionersStartEndDate.get('registrationStep')) {
      case 1:
        return (
          <SelectionView
            params={params}
            props={this.props}
            upperState={this.state}
            collapseMenu={this.collapseMenu}
            selectAvailability={this.selectAvailability}
            handleSaveClick={this.handleSaveClick}
            handleChange={this.handleChange}
            sixDaysForward={this.sixDaysForward}
            sixDaysBack={this.sixDaysBack}
          />
        );
      case 2:
        return (
          <SignUp
            setRegistrationStep={setRegistrationStep}
            createPatient={createPatient}
            practitionersStartEndDate={practitionersStartEndDate}
            logo={logo}
            address={address}
            appointmentInfo={appointmentInfo}
            removeReservation={removeReservation}
            bookingWidgetPrimaryColor={bookingWidgetPrimaryColor}
          />
        );
      case undefined:
        return (
          <div>Loading..</div>
        );
    }
  }
}

Availabilities.defaultProps = {
  bookingWidgetPrimaryColor: '#ff715a',
};

export default Availabilities;
