
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RequestListItem from './RequestListItem';
import { List } from '../library';
import styles from './styles.scss';

import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../thunks/fetchEntities';
import { setHoverRequestId } from '../../actions/requests';

class RequestList extends Component {
  constructor(props) {
    super(props);
    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
  }

  confirmAppointment(request) {
    const { updateEntityRequest, createEntityRequest } = this.props;
    const appointment = {
      startTime: request.get('startTime'),
      endTime: request.get('endTime'),
      patientId: request.get('patientId'),
      serviceId: request.get('serviceId'),
      practitionerId: request.get('practitionerId'),
      chairId: request.get('chairId'),
      note: request.note,
    };

    createEntityRequest({ key: 'appointments', entityData: appointment })
      .then(() => {
        const modifiedRequest = request.set('isCancelled', true);
        updateEntityRequest({ key: 'requests', model: modifiedRequest });
      }).catch(err => console.log(err));
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
  }, dispatch);
}

/*
function mapStateToProps({requests}){
  return {
    clickedId: requests.get('clickedId'),
  }
}*/

const enhance = connect(null, mapActionsToProps);

export default enhance(RequestList);
