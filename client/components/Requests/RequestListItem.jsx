import React, { Component, PropTypes } from 'react';
import { ListItem } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import AppointmentShowData from '../Appointment/AppointmentShowData';
import withHoverable from '../../hocs/withHoverable';


class RequestListItem extends Component {

  render() {
    const {request, patient, service } = this.props;

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

    return (
        <ListItem className={styles.requestListItem}>
          <MonthDay month={data.month} day={data.day} />
          <RequestData time={data.time} nameAge={data.nameAge} phoneNumber={data.phoneNumber} service={data.service}/>
          {this.props.isHovered ? <AppointmentShowData data={data} /> : null }
        </ListItem>
    );
  }
}

RequestListItem.propTypes = {
  patient: PropTypes.object.isRequired,
  request: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
};

export default withHoverable(RequestListItem);