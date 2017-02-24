
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RequestListItem from './RequestListItem';
import { List } from '../library';
import styles from './styles.scss';

import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../thunks/fetchEntities';

class RequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedId: null,
    }

    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
    this.setClickedId = this.setClickedId.bind(this);
  }

  setClickedId(id) {
    if(id === this.state.clickedId){
      this.setState({ clickedId: null });
    }else {
      this.setState({clickedId: id });
    }
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
    const { sortedRequests } = this.props;

    return (
      <List className={styles.requestList}>
        {sortedRequests.map((request) => {
          return (
            <RequestListItem
              key={request.id}
              request={request}
              patient={this.props.patients.get(request.get('patientId'))}
              service={this.props.services.get(request.get('serviceId'))}
              practitioner={this.props.practitioners.get(request.get('practitionerId'))}
              chair={this.props.chairs.get(request.get('chairId'))}
              confirmAppointment={this.confirmAppointment}
              removeRequest={this.removeRequest}
              clickedId={this.state.clickedId}
              setClickedId={this.setClickedId}
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
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    createEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);


export default enhance(RequestList);
