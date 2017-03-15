
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RequestsContainer from '../../containers/RequestContainer';
import fetchReputationData from '../../thunks/fetchReputationData';
import fetchReviewsData from '../../thunks/fetchReviewsData';
import GuageTest from '../demo/GuageTest';
import styles from './styles.scss';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.fetchReputationData();
    // this.props.fetchReviewsData();
  }

  renderCards() {
    const {
      listingCount,
      errorCount,
      missingCount,
      lastFetchedListings,
      statusListings,
      fetchReputationData,
      statusReviews,
      lastFetchedReviews,
      fetchReviewsData,
      ratingCounts,
    } = this.props;
    
    // TODO: for now connect Reviews card to Listings card props until its api integration
    return (
    <div style={{display: 'flex', width: '100%'}}>
      <div className={styles.requestContainer}>
        <RequestsContainer />
      </div>
    </div>
    );
  }

  render() {
    return (
      <div style={{ padding: '20px' }}>
        {this.renderCards()}
        <GuageTest />
      </div>
    );
  }
}

function mapStateToProps({ reputation, reviews }) {
  return {
    lastFetchedListings: reputation.get('lastFetched'),
    statusListings: reputation.get('status'),
    listingCount: reputation.getIn(['data', 'sourcesFound']),
    errorCount: reputation.getIn(['data', 'sourcesFoundWithErrors']),
    missingCount: reputation.getIn(['data', 'sourcesNotFound']),

    statusReviews: reviews.get('status'),
    lastFetchedReviews: reviews.get('lastFetched'),
    ratingCounts: reviews.getIn(['data', 'ratingCounts'])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchReputationData,
    fetchReviewsData,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);
