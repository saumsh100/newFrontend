
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';
import { connect } from 'react-redux';
import Reputation from '../components/Reputation';

class ReputationContainer extends Component {
  componentDidMount() {
    this.props.fetchEntitiesRequest({
      id: 'reviews',
      url: '/api/reputation/reviews',
    });
    this.props.fetchEntitiesRequest({
      id: 'listings',
      url: '/api/reputation/listings',
    });
  }

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

function mapStateToProps({ apiRequests }) {
  const reviews = (apiRequests.get('reviews') ? apiRequests.get('reviews').data : null);
  const listings = (apiRequests.get('listings') ? apiRequests.get('listings').data : null);
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ReputationContainer);
