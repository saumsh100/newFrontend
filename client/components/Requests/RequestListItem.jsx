
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'react-popover';
import { ListItem } from '../library';
import { checkIfUsersEqual } from '../Utils';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import RequestPopover from './RequestPopover';
import withHoverable from '../../hocs/withHoverable';

class RequestListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewRequest: false,
    };
    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
  }

  onClickConfirm() {
    this.props.confirmAppointment(this.props.request, this.props.patientUser);
  }

  onClickRemove() {
    this.props.removeRequest(this.props.request);
  }

  renderListItem({
    patientUser,
    data,
    request,
    requestingUser,
    requestType,
    openRequest,
  }) {
    return (
      <ListItem
        className={styles.requestListItem}
        data-test-id={`${patientUser.get('firstName')}${patientUser.get('lastName')}AppointmentRequest`}
        onClick={() => openRequest(request.id)}
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
    );
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

    const fullName = patientUser
      .get('firstName')
      .concat(' ', patientUser.get('lastName'));

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
        {this.renderListItem({
          patientUser,
          data,
          request,
          requestingUser,
          requestType,
          openRequest: this.props.openRequest,
        })}
      </Popover>
    );
  }
}

RequestListItem.propTypes = {
  request: PropTypes.shape({}).isRequired,
  service: PropTypes.shape({}),
  patientUser: PropTypes.shape({}),
  practitioner: PropTypes.shape({}),
  requestId: PropTypes.string,
  popoverRight: PropTypes.string,
  requestingUser: PropTypes.shape({}),
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  confirmAppointment: PropTypes.func,
  removeRequest: PropTypes.func,
  openRequest: PropTypes.func,
  isHovered: PropTypes.bool,
};

export default withHoverable(RequestListItem);
