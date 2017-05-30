
import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import RequestListItem from './RequestListItem';
import { List } from '../library';
import styles from './styles.scss';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../thunks/fetchEntities';
import { setHoverRequestId } from '../../actions/requests';
import { selectAppointment } from '../../actions/schedule';


class RequestList extends Component {
  constructor(props) {
    super(props);
    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
  }

  confirmAppointment(request) {
    const {
      selectAppointment,
      location,
    } = this.props;

    if(location === '/') {
      this.props.push('/schedule');
    }
    const modifiedRequest = request.set('isCancelled', true);

    const appointment = {
      requestModel: modifiedRequest,
      requestId: request.get('id'),
      startDate: request.get('startDate'),
      endDate: request.get('endDate'),
      patientId: request.get('patientId'),
      serviceId: request.get('serviceId'),
      note: request.note,
      isSyncedWithPMS: false,
      customBufferTime: 0,
      request: true,
    };

    selectAppointment(appointment);

    // TODO possibly do something here to trigger creating of a "submitted" popup or dialog
    console.log('[ TEMP ] SYNCLOG: Creating appointment in the PMS.');
  }

  removeRequest(request) {
    this.props.deleteEntityRequest({ key: 'requests', id: request.get('id') });
  }

  render() {
    const { sortedRequests, patients, services, setHoverRequestId } = this.props;
    return (
      <List className={styles.requestList}>
        {sortedRequests.map((request) => {
          //const active = request.get('id') === this.props.setHoverRequestId;
          return (
            <RequestListItem
              key={request.id}
              request={request}
              patient={patients.get(request.get('patientId'))}
              service={services.get(request.get('serviceId'))}
              confirmAppointment={this.confirmAppointment}
              removeRequest={this.removeRequest}
              setClickedId={setHoverRequestId}
            />
          );
        })}
      </List>
    );
  }
}

RequestList.propTypes = {
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  setHoverRequestId: PropTypes.func,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    createEntityRequest,
    setHoverRequestId,
    selectAppointment,
    push,
  }, dispatch);
}


function mapStateToProps({schedule}){
  return {
    selectedAppointment: schedule.toJS().selectedAppointment,
  };
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(RequestList);
