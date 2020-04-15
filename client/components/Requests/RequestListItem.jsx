
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'react-popover';
import { ListItem } from '../library';
import { checkIfUsersEqual } from '../Utils';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import RequestPopover from './RequestPopover';
import PatientUser from '../../entities/models/PatientUser';
import Practitioner from '../../entities/models/Practitioners';
import Service from '../../entities/models/Service';
import Request from '../../entities/models/Request';
import withHoverable from '../../hocs/withHoverable';

class RequestListItem extends Component {
  constructor(props) {
    super(props);
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

  renderListItem({ patientUser, data, request, requestingUser, requestType, openRequest }) {
    return (
      <ListItem className={styles.requestListItem} onClick={() => openRequest(request.id)}>
        <MonthDay month={data.month} day={data.day} type={requestType} />
        <RequestData
          time={data.time}
          name={data.name}
          age={data.age}
          phoneNumber={data.phoneNumber}
          service={data.service}
          requestCreatedAt={request.createdAt}
          birthDate={patientUser.get('birthDate')}
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
      insuranceGroupId: request.insuranceGroupId,
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
            insuranceGroupId={data.insuranceGroupId}
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
  request: PropTypes.instanceOf(Request).isRequired,
  service: PropTypes.instanceOf(Service).isRequired,
  patientUser: PropTypes.instanceOf(PatientUser).isRequired,
  practitioner: PropTypes.instanceOf(Practitioner),
  requestId: PropTypes.string,
  popoverRight: PropTypes.string,
  requestingUser: PropTypes.instanceOf(PatientUser),
  confirmAppointment: PropTypes.func.isRequired,
  removeRequest: PropTypes.func.isRequired,
  openRequest: PropTypes.func.isRequired,
};

RequestListItem.defaultProps = {
  popoverRight: '',
  practitioner: null,
  requestingUser: null,
  requestId: '',
};

export default withHoverable(RequestListItem);
