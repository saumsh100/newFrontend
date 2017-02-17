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
    this.removeRequest = this.removeRequest.bind(this);
  }

  confirmAppointment() {
    const { request, updateEntityRequest, createEntityRequest } = this.props;
    const appointment = {
      startTime: request.get('startTime'),
      endTime: request.get('endTime'),
      patientId: request.get('patientId'),
      serviceId: request.get('serviceId'),
      practitionerId: request.get('practitionerId'),
      chairId: request.get('chairId'),
      comment: request.comment,
    };

    createEntityRequest({ key: 'appointments', entityData: appointment })
      .then((resp) => {
          console.log("it returned!!!!!!");
      }).catch(err => console.log(err));


    const modifiedRequest = {
      id: request.get('id'),
      isCancelled: true,
    };
    //updateEntityRequest({key: 'requests', update: modifiedRequest});
  }


  removeRequest() {
    const { request, deleteEntityRequest } = this.props;
    deleteEntityRequest({ key: 'requests', id: request.get('id') });
  }

  render() {
    const {
      request,
      patient,
      service,
      isHovered,
    } = this.props;

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
      showHoverComponents = (
        <div>
          <ConfirmAppointment className={styles.confirmAppCheck} />
          <AppointmentShowData data={data} />
          <IconButton icon={'times'} onClick={this.removeRequest} />
        </div>
      );
    }

    return (
      <ListItem onClick={this.confirmAppointment}>
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
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  isHovered: PropTypes.bool,
};

export default withHoverable(RequestListItem);