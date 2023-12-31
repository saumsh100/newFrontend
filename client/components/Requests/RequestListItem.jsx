import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from 'react-popover';
import { ListItem, getFormattedTime, getUTCDate } from '../library';
import { checkIfUsersEqual } from '../Utils';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from '../Dashboard/styles';
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
    this.props.removeRequest(this.props.request, this.props.patientUser);
  }

  renderListItem({ patientUser, data, request, requestingUser, requestType, openRequest, tab }) {
    return (
      <ListItem
        className={tab === 'dasboardReq' ? styles.dashRequestListItem : styles.requestListItem}
        onClick={() => openRequest(request.id)}
      >
        <MonthDay month={data.month} day={data.day} type={requestType} tab={tab} />
        <RequestData
          time={data.time}
          name={data.name}
          age={data.age}
          phoneNumber={data.phoneNumber}
          service={data.service}
          requestCreatedAt={request.createdAt}
          birthDate={patientUser.get('birthDate')}
          requestingUser={checkIfUsersEqual(patientUser, requestingUser)}
          onWaitlist={request.onWaitlist}
          tab={tab}
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
      timezone,
      tab,
    } = this.props;

    if (!request || !patientUser) {
      return null;
    }

    const serviceName = service ? service.name : '';

    const fullName = patientUser.get('firstName').concat(' ', patientUser.get('lastName'));
    const startDate = request.get('startDate');
    const endDate = request.get('endDate');
    const requestDate = getUTCDate(startDate, timezone);

    const data = {
      time: getFormattedTime(startDate, endDate, timezone),
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
      month: requestDate.format('MMM'),
      day: requestDate.format('DD'),
    };

    const requestType = request.sentRecallId ? 'RECALL' : 'WEBSITE';

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
            preferences={request.preferences}
            availableTimes={request.availableTimes}
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
          tab,
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
  timezone: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
};

RequestListItem.defaultProps = {
  popoverRight: '',
  practitioner: null,
  requestingUser: null,
  requestId: '',
};

export default withHoverable(RequestListItem);
