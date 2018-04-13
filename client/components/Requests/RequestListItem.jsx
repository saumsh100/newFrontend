
import React, { Component, PropTypes } from 'react';
import Popover from 'react-popover';
import { ListItem, IconButton, Icon } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import RequestPopover from './RequestPopover';
import withHoverable from '../../hocs/withHoverable';

const checkIfUsersEqual = (patientUser, requestingUser) => {
  if (requestingUser && patientUser && patientUser.get('id') !== requestingUser.get('id')) {
    return requestingUser;
  }
  return null;
};

class RequestListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewRequest: false,
    };
    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
  }

  onClickConfirm() {
    this.props.confirmAppointment(this.props.request, this.props.patientUser);
  }

  onClickRemove() {
    this.props.removeRequest(this.props.request);
  }

  render() {
    const {
      request,
      service,
      patientUser,
      practitioner,
      requestId,
      popoverRight,
      requestingUser,
    } = this.props;

    if (!request || !patientUser) {
      return null;
    }

    const serviceName = service ? service.name : '';

    const fullName = patientUser.get('firstName').concat(' ', patientUser.get('lastName'));

    const data = {
      time: request.getFormattedTime(),
      age: '',
      name: fullName,
      nameAge: '',
      email: patientUser.email,
      service: serviceName,
      phoneNumber: patientUser.phoneNumber,
      note: request.note,
      insuranceCarrier: request.insuranceCarrier,
      insuranceMemberId: request.insuranceMemberId,
      month: request.getMonth(),
      day: request.getDay(),
    };

    const requestType = request.sentRecallId ? 'RECALL' : 'NEW';

    return (
      <Popover
        className={styles.requestPopover}
        isOpen={requestId === request.id}
        body={[
          <RequestPopover
            time={data.time}
            service={data.service}
            note={data.note}
            insuranceCarrier={data.insuranceCarrier}
            insuranceMemberId={data.insuranceMemberId}
            practitioner={practitioner}
            patient={patientUser}
            request={request}
            closePopover={() => this.props.openRequest(null)}
            acceptRequest={this.onClickConfirm}
            rejectRequest={this.onClickRemove}
            requestingUser={checkIfUsersEqual(patientUser, requestingUser)}
          />,
        ]}
        preferPlace={popoverRight || 'left'}
        tipSize={12}
        onOuterAction={() => this.props.openRequest(null)}
      >
        <ListItem
          className={styles.requestListItem}
          data-test-id={`${patientUser.get('firstName')}${patientUser.get(
            'lastName'
          )}AppointmentRequest`}
          onClick={() => this.props.openRequest(request.id)}
        >
          <MonthDay month={data.month} day={data.day} type={requestType} />
          <RequestData
            time={data.time}
            name={data.name}
            age={data.age}
            phoneNumber={data.phoneNumber}
            service={data.service}
            requestCreatedAt={request.createdAt}
            requestingUser={checkIfUsersEqual(patientUser, requestingUser)}
          />
        </ListItem>
      </Popover>
    );
  }
}

RequestListItem.propTypes = {
  request: PropTypes.object.isRequired,
  service: PropTypes.object,
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  isHovered: PropTypes.bool,
};

export default withHoverable(RequestListItem);
