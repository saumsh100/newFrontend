
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';
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
    const {
      reviews,
      listings,
    } = this.props;

    console.log(reviews);
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

  return {
    reviews,
    listings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(ReputationContainer);
