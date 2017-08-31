
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';
import Reputation from '../components/Reputation/Reviews';


class ReputationContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    // can change range
    const params = {
      startDate: moment().subtract(30, 'days')._d,
      endDate: moment()._d,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'reviews',
        url: '/api/reputation/reviews',
        params,
      }),
      this.props.fetchEntitiesRequest({
        id: 'listings',
        url: '/api/reputation/listings',
        params,
      }),
    ]).then(() => {
      this.setState({
        loaded: true,
      });
    });
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
