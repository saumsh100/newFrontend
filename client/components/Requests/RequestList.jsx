
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
import { checkPatientUser } from '../../thunks/schedule';

class RequestList extends Component {
  constructor(props) {
    super(props);
    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
  }

  confirmAppointment(request, patientUser) {
    const {
      location,
      push,
      checkPatientUser,
    } = this.props;

    if (location === '/') {
      push('/schedule');
    }

    const modifiedRequest = request.set('isConfirmed', true);
    const appointment = {
      requestId: request.get('id'),
      startDate: request.get('startDate'),
      endDate: request.get('endDate'),
      serviceId: request.get('serviceId'),
      note: request.note,
      isSyncedWithPMS: false,
      customBufferTime: 0,
      request: true,
      requestModel: modifiedRequest,
    };

    checkPatientUser(patientUser, appointment);

    // TODO possibly do something here to trigger creating of a "submitted" popup or dialog
    console.log('[ TEMP ] SYNCLOG: Creating appointment in the PMS.');
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
      services,
      patientUsers,
      setHoverRequestId,
    } = this.props;

    console.log(sortedRequests)
    console.log(patientUsers)
    const showComponent = sortedRequests.length ? (
      sortedRequests.map((request) => {
        //const active = request.get('id') === this.props.setHoverRequestId;
        return (
          <RequestListItem
            key={request.id}
            request={request}
            service={services.get(request.get('serviceId'))}
            patientUser={patientUsers.get(request.get('patientUserId'))}
            confirmAppointment={this.confirmAppointment}
            removeRequest={this.removeRequest}
            setClickedId={setHoverRequestId}
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
    checkPatientUser,
    push,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(RequestList);
