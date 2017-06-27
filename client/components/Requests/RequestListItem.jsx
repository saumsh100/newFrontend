
import React, {Component, PropTypes } from 'react';
import Popover from 'react-popover';
import { ListItem, IconButton, Icon } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import AppointmentShowData from '../Appointment/AppointmentShowData';
import withHoverable from '../../hocs/withHoverable';

class RequestListItem extends Component {
  constructor(props) {
    super(props);
    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
  }

  onClickConfirm() {
    this.props.confirmAppointment(this.props.request, this.props.patientUser);
  }

  onClickRemove() {
    this.props.removeRequest(this.props.request);
  }

  /*
  //set clicked handler on listitem
  setId(){
    const { setClickedId, request } = this.props;
    setClickedId({id: request.get('id')});
  }*/

  render() {
    const {
      request,
      //patient,
      service,
      isHovered,
      active,
      patientUser
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
      mobilePhoneNumber: patientUser.phoneNumber,
      note: request.note,
      month: request.getMonth(),
      day: request.getDay(),
    };

    let showHoverComponents = (<div className={styles.clickHandlers__newreqText}>New</div>);

    if (isHovered) {
     showHoverComponents = (
        <div>
          <div className={styles.clickHandlers}>
            <IconButton
              icon={'times-circle-o'}
              className={styles.clickHandlers__remove}
              onClick={this.onClickRemove}
              data-test-id={`${patientUser.get('firstName')}${patientUser.get('lastName')}Reject`}
            />
            <Icon
              icon={'check-circle'}
              className={styles.clickHandlers__confirm}
              onClick={this.onClickConfirm}
              data-test-id={`${patientUser.get('firstName')}${patientUser.get('lastName')}Accept`}
            />
          </div>
        </div>
      );
    }

    return (
      <ListItem
        className={styles.requestListItem}
        data-test-id={`${patientUser.get('firstName')}${patientUser.get('lastName')}AppointmentRequest`}
      >
        <Popover
          className={styles.requestPopover}
          isOpen={isHovered}
          body={[(
            <AppointmentShowData
              nameAge={data.name}
              time={data.time}
              service={data.service}
              phoneNumber={data.mobilePhoneNumber}
              email={data.email}
              note={data.note}
            />
          )]}
          preferPlace="left"
          tipSize={12}
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
          phoneNumber={data.mobilePhoneNumber}
          service={data.service}
        />
        {showHoverComponents}
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
