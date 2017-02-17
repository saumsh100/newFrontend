import React, { Component, PropTypes } from 'react';
import { ListItem, IconButton } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import AppointmentShowData from '../Appointment/AppointmentShowData';
import withHoverable from '../../hocs/withHoverable';
import ConfirmAppointment from '../Appointment/ConfirmAppointment';


class RequestListItem extends Component {

  constructor(props) {
    super(props)
    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  confirmAppointment() {
    const { request, fetchUpdate} = this.props;

    const modifiedRequest = {
      id: request.get('id'),
      isConfirmed: true,
      comment: "Changed Confirmed to true",
    };

    fetchUpdate({key: 'requests', patient: modifiedRequest});
  }

  deleteRequest(){
    const { request, fetchDelete } = this.props;
      fetchDelete({key: 'requests', id: request.get('id')});
  }

  render() {

    const {request, patient, service, isHovered} = this.props;

    const data = {
      time: request.getFormattedTime(),
      nameAge: patient.getFullName().concat(', ', request.getAge(patient.birthDate)),
      email: patient.email,
      service: service.name,
      phoneNumber: patient.phoneNumber,
      comment: request.comment,
      month: request.getMonth(),
      day: request.getDay(),
    };

    let showHoverComponents = null;
    if (isHovered) {
      showHoverComponents = (<div>
        <ConfirmAppointment className={styles.confirmAppCheck} />
        <AppointmentShowData data={data} />
        <IconButton icon={'times'} onClick={this.deleteRequest} />
      </div>);
    }

    return (
      <ListItem >
        <MonthDay month={data.month} day={data.day} />
        <RequestData
          time={data.time}
          nameAge={data.nameAge}
          phoneNumber={data.phoneNumber}
          service={data.service}
        />
        {showHoverComponents}
      </ListItem>
    );

  }
}

RequestListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
  fetchUpdate: PropTypes.func,
  isHovered: PropTypes.bool,
  fetchDelete: PropTypes.func,
};

export default withHoverable(RequestListItem);