
import React, {Component, PropTypes } from 'react';
import Popover from 'react-popover';
import { ListItem, IconButton, Icon } from '../library';
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
    } = this.props;

    if (!request || !patientUser) {
      return null;
    }

    const serviceName = service ? service.name : ''

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
      month: request.getMonth(),
      day: request.getDay(),
    };

    return (
      <ListItem
        className={styles.requestListItem}
        data-test-id={`${patientUser.get('firstName')}${patientUser.get('lastName')}AppointmentRequest`}
        onClick={() => this.props.openRequest(request.id)}
      >
        <Popover
          className={styles.requestPopover}
          isOpen={requestId === request.id}
          body={[(
            <RequestPopover
              time={data.time}
              service={data.service}
              note={data.note}
              practitioner={practitioner}
              patient={patientUser}
              request={request}
              closePopover={() => this.props.openRequest(null)}
              acceptRequest={this.onClickConfirm}
              rejectRequest={this.onClickRemove}
            />
          )]}
          preferPlace="left"
          tipSize={12}
          onOuterAction={() => this.props.openRequest(null)}
        >
          <MonthDay
            month={data.month}
            day={data.day}
          />
        </Popover>
        <RequestData
          time={data.time}
          name={data.name}
          age={data.age}
          phoneNumber={data.phoneNumber}
          service={data.service}
          requestCreatedAt={request.createdAt}
        />
      </ListItem>
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
