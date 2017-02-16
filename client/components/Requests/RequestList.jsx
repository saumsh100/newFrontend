
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RequestListItem from './RequestListItem';
import { List } from '../library';
import styles from './styles.scss';
import { fetchUpdate } from '../../thunks/fetchEntities';



class RequestList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sortedRequests = this.props.requests.sort((a, b) => {
      return Date.parse(b.startTime) - Date.parse(a.startTime);
    });

    return (
        <List className={styles.requestList}>
          {sortedRequests.toArray().map((request) => {
            if(!request.get('isCancelled')){
              return (
                <RequestListItem
                  key={request.id}
                  request={request}
                  patient={this.props.patients.get(request.get('patientId'))}
                  service={this.props.services.get(request.get('serviceId'))}
                  practitioner={this.props.practitioners.get(request.get('practitionerId'))}
                  fetchUpdate={this.props.fetchUpdate}
                />
              );
            }})}
        </List>
    );
  }
}

RequestList.propTypes = {
  fetchUpdate: PropTypes.func,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    fetchUpdate,
  }, dispatch);
}
const enhance = connect(null, mapActionsToProps);


export default enhance(RequestList);
