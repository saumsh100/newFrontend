import React, {Component, PropTypes } from 'react';
import { ListItem, IconButton, Icon } from '../library';
import MonthDay from './MonthDay';
import RequestData from './RequestData';
import styles from './styles.scss';
import AppointmentShowData from '../Appointment/AppointmentShowData';
import withHoverable from '../../hocs/withHoverable';
import Popover from 'react-popover';



class RequestListItem extends Component {

  constructor(props) {
    super(props)
    this.onClickConfirm = this.onClickConfirm.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.setId = this.setId.bind(this);
  }

  onClickConfirm(){
    this.props.confirmAppointment(this.props.request);
  }

  onClickRemove(){
    this.props.removeRequest(this.props.request);
  }

  setId(){
    const { setClickedId, request } = this.props;
    setClickedId({id: request.get('id')});
  }

  render() {
    const {
      request,
      patient,
      service,
      isHovered,
      active,
    } = this.props;

    const data = {
      time: request.getFormattedTime(),
      nameAge: patient.getFullName().concat(', ', request.getAge(patient.birthDate)),
      email: patient.email,
      service: service.name,
      phoneNumber: patient.phoneNumber,
      note: request.note,
      month: request.getMonth(),
      day: request.getDay(),
    };

    let showHoverComponents = (<div className={styles.requestData__newreqText}>New</div>);

    if (isHovered) {
      showHoverComponents = (
        <div>
          <div className={styles.clickHandlers}>
            <IconButton
              icon={'times-circle-o'}
              className={styles.clickHandlers__remove}
              onClick={this.onClickRemove}
            />
            <IconButton
              icon={'check-circle'}
              className={styles.clickHandlers__confirm}
              onClick={this.onClickConfirm}
            />
          </div>
        </div>
      );
    }



    return (
        <ListItem
          className={styles.requestListItem}
          onClick={this.setId}>
          <Popover
            className={styles.requestPopover}
            isOpen={active}
            body={[(
              <div>
                <AppointmentShowData
                  nameAge={data.nameAge}
                  time={data.time}
                  service={data.service}
                  phoneNumber={data.phoneNumber}
                  email={data.email}
                  note={data.note}
                />
              </div>
            )]}
            preferPlace="left"
          >
            <MonthDay
              month={data.month}
              day={data.day}
            />
          </Popover>
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