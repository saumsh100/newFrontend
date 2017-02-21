
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';
import Availabilities from '../components/Availabilities';
import {
  sixDaysShift,
  setDay,
  setPractitioner,
  setService,
  createPatient,
} from  '../thunks/availabilities';

class Availability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDay: new Date(),
      selectedEndDay: moment().add(4, 'd')._d,
      modalIsOpen: false,
      practitonersStartEndDate: {},
    };
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'practitioners' });
    this.props.fetchEntities({ key: 'services' });
    
  }

  componentWillReceiveProps(nextProps) {

    const { setPractitioner } = this.props;
    const thisPractitioners = this.props.practitioners.get('models').toArray();
    const nextPractitioners = nextProps.practitioners.get('models').toArray();
    
    const { availabilitiesForm } = nextProps;
    const oldAvailabilitiesForm = this.props.availabilitiesForm;
    const nextFormPractitionerId = availabilitiesForm && availabilitiesForm.values &&
    availabilitiesForm.values.practitionerId;
    
    const prevFormPractitionerId = oldAvailabilitiesForm && oldAvailabilitiesForm.values &&
    oldAvailabilitiesForm.values.practitionerId;

    const { practitonersStartEndDate } = nextProps;
    const practitonersStartEndDatetoJS = this.props.practitonersStartEndDate.toJS() 
    const nextpractitonersStartEndDatetoJS = practitonersStartEndDate.toJS(); 
    
    let prevPractitionerId = practitonersStartEndDatetoJS.practitionerId;
    let nextPractitionerId = nextpractitonersStartEndDatetoJS.practitionerId;
    let newService = null;
    if (nextFormPractitionerId && prevFormPractitionerId ) {
      prevPractitionerId = prevFormPractitionerId;
      nextPractitionerId = nextFormPractitionerId;

      if (nextPractitionerId !== prevFormPractitionerId) {
        setPractitioner({ practitionerId: nextPractitionerId });
      }

    }

    let shouldAvailabilitiesBeUpdated = false;

    if ((!nextPractitionerId && !nextFormPractitionerId ) && nextPractitioners && nextPractitioners.length ) {
      const practitionerId = nextPractitioners[0].id
      setPractitioner({ practitionerId });

    }

    if (!nextPractitionerId && nextPractitioners && nextPractitioners.length ) {
      const practitionerId = nextPractitioners[0].id
      setPractitioner({ practitionerId });

    }


    const thisPractitionersStartEndDate = practitonersStartEndDatetoJS[nextPractitionerId];
    let params = {}
    const selectedDays = nextpractitonersStartEndDatetoJS[nextPractitionerId];
    
    if (!selectedDays) {
        params = {
          practitionerId: nextPractitionerId,
          serviceId: this.state.serviceId,
          startDate: this.state.selectedStartDay,
          endDate: this.state.selectedEndDay,
        };
        params.retrieveFirstTime = true;
        shouldAvailabilitiesBeUpdated = true;
    } else if (selectedDays && thisPractitionersStartEndDate) {
      const { selectedEndDay, selectedStartDay } = selectedDays;
      const thisselectedEndDay = thisPractitionersStartEndDate.selectedEndDay;
      if (thisselectedEndDay !== selectedEndDay || nextPractitionerId !== prevPractitionerId ) {
        params = {
          practitionerId: nextPractitionerId,
          serviceId: this.state.serviceId,
          startDate: selectedStartDay,
          endDate: selectedEndDay,
        };

        if (selectedDays.retrievedFirstTime) {
          params.retrieveFirstTime = true;
        }
      }
      shouldAvailabilitiesBeUpdated = true;
    }

    const thisServices = this.props.services.get('models').toArray();
    const nextServices = nextProps.services.get('models').toArray();
    
    if (!isEqual(thisServices, nextServices)) {
        

      const newService = nextServices
        .filter(s =>
          includes(s.allowedPractitioners, nextPractitionerId)
        )[0];

      const newServiceId = newService && newService.id;

      this.setState({ serviceId: newServiceId })
        params = {
          practitionerId: nextPractitionerId || this.state.practitionerId,
          serviceId: newServiceId || this.state.serviceId,
          startDate: this.state.selectedStartDay,
          endDate: this.state.selectedEndDay,
          retrieveFirstTime: false,
        };

        if (selectedDays) {
          const { selectedStartDay, selectedEndDay, retrievedFirstTime } = selectedDays;
          params.startDate = selectedStartDay;
          params.endDate = selectedEndDay;
          if (selectedDays.retrievedFirstTime) {
             params.retrieveFirstTime = true;
          }
        } else {
          params.retrieveFirstTime = true;
        }
        shouldAvailabilitiesBeUpdated = true; 
    }

    if (shouldAvailabilitiesBeUpdated) {      
      this.props.fetchEntities({ key: 'availabilities',
        params,
      });    
    }


    if (!isEqual(thisPractitioners, nextPractitioners)) {
      this.setState({ practitionerId: nextPractitioners[0].id }, () => {
        this.props.fetchEntities({ key: 'services',
          params: { practitionerId: this.state.practitionerId }
        });
      });
    }
  }

  getAppointmentsSorted() {
    const { 
      practitonersStartEndDate,
      sixDaysShift,
      availabilitiesForm,
      createPatient,
    } = this.props;
    let { selectedEndDay, selectedStartDay } = practitonersStartEndDate;
    
    // const practitionerId = practitonersStartEndDate.toJS().practitionerId;

    const practitionerId =  (availabilitiesForm
    && availabilitiesForm.values && availabilitiesForm.values.practitionerId)
    || practitonersStartEndDate.toJS().practitionerId


    const prStardEndDate = practitonersStartEndDate.toJS()[practitionerId]; 
    const sortedByDate = this.props.availabilities.get('models')
      .toArray()
      .filter(a => a.practitionerId === practitionerId)
      .sort((a, b) => {
        if (moment(a.date) > moment(b.date)) return 1;
        if (moment(a.date) < moment(b.date)) return -1;
        return 0;
      });

    if (!prStardEndDate && sortedByDate && sortedByDate.length) {
      selectedStartDay = sortedByDate[0].date;
      selectedEndDay = moment(selectedStartDay).add(4, 'days')._d;

      sixDaysShift({ selectedStartDay, selectedEndDay, practitionerId, retrievedFirstTime: true })

    }

    if (prStardEndDate) {
      selectedStartDay = prStardEndDate.selectedStartDay;
      selectedEndDay = prStardEndDate.selectedEndDay;
    }

    const filteredByDoctor = sortedByDate
      .filter(a =>
        moment(a.date).isBetween(selectedStartDay, selectedEndDay, 'days', true)
      );
    return { filteredByDoctor, practitionerId };
  }




  render() {
    const { filteredByDoctor, practitionerId } = this.getAppointmentsSorted()

    return (
      <Availabilities
        availabilities={filteredByDoctor}
        practitionerId={practitionerId}
        services={this.props.services.get('models').toArray()}
        practitioners={this.props.practitioners.get('models').toArray()}
        sixDaysShift={this.props.sixDaysShift}
        setDay={this.props.setDay}
        setPractitioner={this.props.setPractitioner}
        setService={this.props.setService}
        practitonersStartEndDate={this.props.practitonersStartEndDate}
        createPatient={this.props.createPatient}
      />
    );
  }
}

function mapStateToProps({ entities, availabilities, form }) {
  return {
    availabilities: entities.get('availabilities'),
    services: entities.get('services'),
    practitioners: entities.get('practitioners'),
    practitonersStartEndDate: availabilities,
    availabilitiesForm: form.availabilities,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    sixDaysShift,
    setDay,
    setPractitioner,
    setService,
    createPatient,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Availability);
