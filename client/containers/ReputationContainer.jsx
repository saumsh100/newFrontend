
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';
import Reputation from '../components/Reputation/index';


class ReputationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
    };
  }

  render() {
    return (
      <div>
        <Loader loaded={this.state.loaded} color="#FF715A">
          <Reputation {...this.props} />
        </Loader>
      </div>
    );
  }
}

ReputationContainer.propTypes = {
  fetchEntitiesRequest: PropTypes.func,
  openForm: PropTypes.func,
};

export default ReputationContainer;
