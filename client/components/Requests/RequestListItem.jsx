import React, { Component, PropTypes } from 'react';
import { ListItem } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import AppointmentShowData from '../Appointment/AppointmentShowData';

class RequestListItem extends Component {

  constructor(props){
    super(props)
    this.state = {
      showResults: false,
    }
    this.showAppointment = this.showAppointment.bind(this);
    this.hideAppointment = this.hideAppointment.bind(this);

  }

  showAppointment() {
    this.setState({showResults: true});
  }

  hideAppointment(){
    this.setState({ showResults: false });
  }

  render() {
    const {request, patient, service } = this.props;

    const data = {
      time: request.getFormattedTime(),
      nameAge: patient.getFullName().concat(', ', request.getAge(patient.birthDate)),
      email: patient.email,
      service: service.name,
      phoneNumber: patient.phoneNumber,
   // insurance: patient.getInsurance().insurance,
      comment: request.comment,
      month: request.getMonth(),
      day: request.getDay(),
    };

    return (
      <div>
        <ListItem onMouseOver={this.showAppointment} onMouseOut={this.hideAppointment} className={styles.requestListItem}>
          <MonthDay month={data.month} day={data.day} />
          <RequestData data={data}/>
        </ListItem>
        {this.state.showResults ? <AppointmentShowData data={data} /> : null }
      </div>
    );
  }
}

RequestListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
};

export default RequestListItem;