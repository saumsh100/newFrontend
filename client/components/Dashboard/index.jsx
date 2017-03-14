
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, IconCard } from '../library';
import Listings from '../Listings';
import Reviews from '../Reviews';
import RequestsContainer from '../../containers/RequestContainer';
import fetchReputationData from '../../thunks/fetchReputationData';
import fetchReviewsData from '../../thunks/fetchReviewsData';
import CardHoc from './cardHoc';
import styles from './styles.scss';
// wrap components with hoc's
const ListingsCard = CardHoc(Listings);
const ReviewsCard = CardHoc(Reviews);


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
      <Grid className={styles.dashboard}>
        <Row>
          <Col className={styles.dashboard__header} xs={12}>
            <div className={styles.dashboard__header_title}>
              Welcome Back, <b>Corina</b>
            </div>
            <Row className={styles.dashboard__header_cards}>
                <IconCard className={styles.primaryColor} xs={12} sm={3} count="12" title="Appointment Booked" icon="calendar" size={10} />
                <IconCard className={styles.primaryBlue} xs={12} sm={3} count="64" title="Appointment Booked" icon="user" size={10} />
                <IconCard className={styles.primaryGreen} xs={12} sm={3} count="16" title="Appointment Booked" icon="bullhorn" size={10} />
                <IconCard className={styles.primaryYellow} xs={12} sm={3} count="23" title="Appointment Booked" icon="star" size={10} />
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
          </Col>
          <Col xs={2} className={styles.dashboard__requestContainer}>
            <RequestsContainer />
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {
    return (
      <div>
        {this.renderCards()}
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
