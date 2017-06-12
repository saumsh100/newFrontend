
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
import * as Actions from '../../actions/patientList';


class RequestList extends Component {
  constructor(props) {
    super(props);
    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
    this.handlePatientClick = this.handlePatientClick.bind(this);
  }

  confirmAppointment(request) {
    const {
      selectAppointment,
      location,
      push,
    } = this.props;

    if (location === '/') {
      push('/schedule');
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

  handlePatientClick(id) {
    const {
      setSelectedPatientId,
      push,
    } = this.props;

    setSelectedPatientId(id);
    push('/patients/list');
  }


  removeRequest(request) {
    const confirmRemove = confirm('Are you sure you want to remove this request?');
    if (confirmRemove) {
      this.props.deleteEntityRequest({ key: 'requests', id: request.get('id') });
    }
  }

  render() {
    const {
      sortedRequests,
      patients,
      services,
      setHoverRequestId,
    } = this.props;

    const showComponent = sortedRequests.length ? (
      sortedRequests.map((request) => {
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
            handlePatientClick={this.handlePatientClick}
          />
        );
      })
    ) : (
      <div className={styles.emptyList}>
        YOU HAVE NO APPOINTMENT REQUESTS
      </div>
    )
    return (
      <List className={styles.requestList}>
        {showComponent}
      </List>
    );
  }
}

RequestList.propTypes = {
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  setHoverRequestId: PropTypes.func,
  push: PropTypes.func,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    createEntityRequest,
    setHoverRequestId,
    selectAppointment,
    setSelectedPatientId: Actions.setSelectedPatientIdAction,
    push,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(RequestList);
