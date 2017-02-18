
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
  }

  render() {
    const {sortedRequests} = this.props;

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
                  updateEntityRequest={this.props.updateEntityRequest}
                  deleteEntityRequest={this.props.deleteEntityRequest}
                  createEntityRequest={this.props.createEntityRequest}
                />
              );
          })}
        </List>
    );
  }
}

RequestList.propTypes = {
  fetchUpdate: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
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
