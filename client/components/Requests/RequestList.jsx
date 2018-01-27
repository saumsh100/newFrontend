
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

    this.state = {
      requestId: null,
    };

    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.openRequest = this.openRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
  }

  confirmAppointment(request, patientUser) {
    const {
      location,
      push,
    } = this.props;

    if (location === '/') {
      push('/schedule');
    }

    const modifiedRequest = request.set('isConfirmed', true);
    const requestData = {
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

    this.props.checkPatientUser(patientUser, requestData);
    this.openRequest(null);
  }


  removeRequest(request) {
    const confirmRemove = confirm('Are you sure you want to reject this request?');
    if (confirmRemove) {
      this.openRequest(null);
      this.props.updateEntityRequest({
        url: `/api/requests/${request.id}/reject`,
        values: {},
      });
    }
  }

  openRequest(id) {
    this.setState({
      requestId: id,
    });
  }

  render() {
    const {
      sortedRequests,
      services,
      patientUsers,
      practitioners,
      setHoverRequestId,
      popoverRight
    } = this.props;


    return (
      <List className={styles.requestList} >
        {sortedRequests.map((request) => {
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
              requestId={this.state.requestId}
              openRequest={this.openRequest}
              popoverRight={popoverRight}
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
