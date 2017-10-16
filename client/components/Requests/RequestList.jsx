
import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import RequestListItem from './RequestListItem';
import { List } from '../library';
import styles from './styles.scss';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../thunks/fetchEntities';
import { setHoverRequestId, setUndoRequest } from '../../actions/requests';
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
      createdAt: request.get('createdAt'),
      startDate: request.get('startDate'),
      endDate: request.get('endDate'),
      serviceId: request.get('serviceId'),
      note: request.note,
      isSyncedWithPms: false,
      customBufferTime: 0,
      request: true,
      requestModel: modifiedRequest,
      practitionerId: request.get('practitionerId'),
    };

    checkPatientUser(patientUser, appointment);

    // TODO possibly do something here to trigger creating of a "submitted" popup or dialog
    console.log('[ TEMP ] SYNCLOG: Creating appointment in the PMS.');
  }


  removeRequest(request) {
    const confirmRemove = confirm('Are you sure you want to reject this request?');
    if (confirmRemove) {
      this.props.updateEntityRequest({
        url: `/api/requests/${request.id}/reject`,
        values: {},
      });
      // this.props.setUndoRequest({ undoRequest: request });
    }
  }

  render() {
    const {
      sortedRequests,
      services,
      patientUsers,
      practitioners,
      setHoverRequestId,
      maxHeight,
    } = this.props;

    const style = {
      maxHeight: maxHeight || '555px',
    };

    return (
      <List className={styles.requestList} style={style}>
        {sortedRequests.map((request) => {
          //const active = request.get('id') === this.props.setHoverRequestId;
          const practitionerId = request.get('practitionerId');
          const practitioner = practitionerId ? practitioners.get(practitionerId) : null;

          return (
            <RequestListItem
              key={request.id}
              request={request}
              service={services.get(request.get('serviceId'))}
              practitioner={practitioner}
              patientUser={patientUsers.get(request.get('patientUserId'))}
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
  services: PropTypes.object.isRequired,
  patientUsers: PropTypes.object.isRequired,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
  updateEntityRequest: PropTypes.func,
  setHoverRequestId: PropTypes.func,
  setUndoRequest: PropTypes.func,
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
    setUndoRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(RequestList);
