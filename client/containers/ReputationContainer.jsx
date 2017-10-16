
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';
import Reputation from '../components/Reputation/Reviews';

class ReputationContainer extends Component {
  render() {
    return (
      <div>
        <Reputation {...this.props} />
      </div>
    );
  }
}

ReputationContainer.propTypes = {
  fetchEntitiesRequest: PropTypes.func,
  openForm: PropTypes.func,
};


export default ReputationContainer;
