
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
    super(props)
    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
  }

  onClickConfirm() {
    this.props.confirmAppointment(this.props.request);
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
      patient,
      service,
      isHovered,
      active,
    } = this.props;

    if (!service) {
      return null;
    }

    const data = {
      time: request.getFormattedTime(),
      age: request.getAge(patient.birthDate),
      name: patient.getFullName(),
      nameAge: patient.getFullName().concat(', ', request.getAge(patient.birthDate)),
      email: patient.email,
      service: service.name,
      mobilePhoneNumber: patient.mobilePhoneNumber,
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
            />
            <Icon
              icon={'check-circle'}
              className={styles.clickHandlers__confirm}
              onClick={this.onClickConfirm}
            />
          </div>
        </div>
      );
    }

    return (
      <ListItem className={styles.requestListItem}>
        <Popover
          className={styles.requestPopover}
          isOpen={isHovered}
          body={[(
            <AppointmentShowData
              nameAge={data.nameAge}
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
          nameAge={data.nameAge}
          phoneNumber={data.mobilePhoneNumber}
          service={data.service}
        />
        {showHoverComponents}
      </ListItem>
    );
  }
}

RequestListItem.propTypes = {
  patient: PropTypes.object,
  request: PropTypes.object.isRequired,
  service: PropTypes.object,
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  isHovered: PropTypes.bool,
};

export default withHoverable(RequestListItem);
