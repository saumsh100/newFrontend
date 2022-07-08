import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import { reset, change } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Card, Col, Grid, Row, Filters, getUTCDate } from '../../library';
import Loader from '../../Loader';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { setReputationFilter } from '../../../actions/reputation';
import setReputationState from '../../../thunks/reputation';
import AverageRating from './Cards/AverageRating';
import RatingsChart from './Cards/RatingsChart';
import ReviewsCard from './Cards/ReviewsCard';
import ReputationDisabled from '../ReputationDisabled';
import filters from './filterOptions';
import styles from './styles.scss';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activationText: '',
      endDate: null,
      startDate: null,
    };

    this.submitDate = this.submitDate.bind(this);
  }

  componentDidMount() {
    if (this.props.hasAccount) {
      const params = {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      };

      this.props
        .setReputationState(params)
        .then(() => {
          this.reviewsContainerHeight = document.getElementById('reviewsContainerRep').clientHeight;
        })
        .catch(() => {
          this.setState({
            activationText:
              'Activate Reviews/Reputation Management package or contact your CareCru account manager for further assistance.',
          });
        });
    }
  }

  submitDate(values) {
    const params = {
      startDate: getUTCDate(values.startDate, this.props.timezone).toLocaleString(),
      endDate: getUTCDate(values.endDate, this.props.timezone).toLocaleString(),
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'reviews',
        url: '/api/reputation/reviews',
        params,
      }),
    ]).then(() => {
      const newState = {
        startDate: getUTCDate(values.startDate, this.props.timezone),
        endDate: getUTCDate(values.endDate, this.props.timezone),
        loader: true,
      };
      this.setState(newState);
    });
  }

  renderInnerContent() {
    const { reviewsData, reviewsList, reviewsFilter } = this.props;

    if (!reviewsData || !reviewsList) {
      return <Loader inContainer />;
    }

    const reviewsStats = reviewsData.toJS();

    const filterSources = reviewsFilter.get('sources').toJS();
    const filterRatings = reviewsFilter.get('ratings').toJS();

    let constructBigComment = reviewsList.toJS();

    constructBigComment = constructBigComment
      .filter((review) => filterSources.indexOf(review.sourceName) > -1 && review)
      .filter((review) => filterRatings.indexOf(review.rating) > -1 && review);

    constructBigComment = constructBigComment.map((review) => ({
      icon: review.sourceName,
      publishedDate: review.publishedDateTime,
      headerLinkName: review.reviewerName,
      headerLinkSite: review.domain,
      siteStars: Number(review.rating),
      siteTitle: review.title,
      sitePreview: review.contentSnippet,
      iconColor: '#ffffff',
      background: '#395998',
      iconAlign: 'flex-end',
      requiredAction: '',
      url: review.url,
      reviewerUrl: review.reviewerUrl,
      reviewId: review.reviewId,
    }));

    const initialValues = {
      sources: {
        CareCru: true,
        Google: true,
        Yelp: true,
        Facebook: true,
        'Rate MDs': true,
        YellowPages: true,
      },

      ratings: {
        '1 Star': true,
        '2 Star': true,
        '3 Star': true,
        '4 Star': true,
        '5 Star': true,
        'No Rating': true,
      },
    };

    return (
      <div id="reviewsContainerRep">
        <header className={styles.reviewHeader}>Reviews</header>
        <Grid className={styles.reviews}>
          <Row className={styles.reviews__wrapper}>
            <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
              <AverageRating
                count={reviewsStats.industryAverageRating}
                rating={reviewsStats.ratingCounts}
              />
            </Col>
            <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
              <Card className={styles.card}>
                <div className={styles.stats}>
                  <span className={styles.stats__count}> {reviewsStats.totalCount} </span>
                  <span className={styles.stats__title}>Total Reviews</span>
                  <div className={styles.stats__rating}>
                    {reviewsStats.ratingCounts['0'] || '0'} with no star rating
                  </div>
                  <span className={styles.stats__bottom}>
                    Industry Average {reviewsStats.industryAverageCount}
                  </span>
                </div>
              </Card>
            </Col>
            <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
              <RatingsChart rating={reviewsStats.ratingCounts} />
            </Col>
            <Row className={styles.rowReviewsFilter}>
              <Col style={{ paddingLeft: '10px' }} xs={12} md={8} sm={9} lg={9}>
                <ReviewsCard
                  data={constructBigComment}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  submitDate={this.submitDate}
                  reviewsContainerHeight={this.reviewsContainerHeight}
                />
              </Col>
              <Col
                style={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
                xs={12}
                md={4}
                sm={3}
                lg={3}
              >
                <Filters
                  key="reviewsFilter"
                  setReputationFilter={this.props.setReputationFilter}
                  filterKey="reviewsFilter"
                  reset={this.props.reset}
                  filters={filters}
                  initialValues={initialValues}
                  change={this.props.change}
                />
              </Col>
            </Row>
          </Row>
        </Grid>
      </div>
    );
  }

  render() {
    return this.props.hasAccount ? (
      this.renderInnerContent()
    ) : (
      <ReputationDisabled activationText={this.state.activationText} />
    );
  }
}

Reviews.propTypes = {
  setReputationFilter: PropTypes.func.isRequired,
  setReputationState: PropTypes.func.isRequired,
  reviewsFilter: PropTypes.instanceOf(Map),
  reviewsData: PropTypes.instanceOf(Map),
  reviewsList: PropTypes.instanceOf(List),
  hasAccount: PropTypes.bool,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
};

Reviews.defaultProps = {
  reviewsData: null,
  reviewsList: List(),
  reviewsFilter: null,
  hasAccount: false,
};

function mapStateToProps({ apiRequests, entities, auth, reputation }) {
  const reviews = apiRequests.get('reviews');
  const reviewsWasFetched =
    reviews && ((reviews.get('wasFetched') && reputation.get('reviewsData').size > 0) || false);
  const reviewsFilter = reviewsWasFetched && reputation.get('reviewsFilter');
  const reviewsData = reviewsWasFetched && reputation.get('reviewsData');
  const reviewsList = reviewsWasFetched && reputation.get('reviewsList');
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const hasAccount = activeAccount && !!activeAccount.get('vendastaId');
  const timezone = auth.get('timezone');

  return {
    reviewsData: reviewsData || null,
    reviewsList: reviewsList || null,
    reviewsFilter: reviewsFilter || null,
    hasAccount,
    timezone,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      setReputationFilter,
      setReputationState,
      reset,
      change,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Reviews);
