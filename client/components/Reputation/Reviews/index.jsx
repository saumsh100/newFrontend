
import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { reset, change } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Card, Col, Grid, Row, Filters } from '../../library';
import Loader from '../../Loader';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { setReputationFilter } from '../../../actions/reputation';
import { setReputationFilterState } from '../../../thunks/reputation';
import AverageRating from './Cards/AverageRating';
import RatingsChart from './Cards/RatingsChart';
import ReviewsCard from './Cards/ReviewsCard';
import ReputationDisabled from '../ReputationDisabled';
import styles from './styles.scss';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      hasAccount: false,
      activationText: '',
      endDate: null,
      startDate: null,
    };

    this.submitDate = this.submitDate.bind(this);
  }

  componentWillMount() {
    const {
      activeAccount,
    } = this.props;

    let hasAccount = false;

    if (activeAccount.get('vendastaId')) {
      hasAccount = true;
    }

    this.setState({
      hasAccount,
    });
  }

  componentDidMount() {
    if (this.state.hasAccount) {
      const params = {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      };

      Promise.all([
        this.props.fetchEntitiesRequest({
          id: 'reviews',
          url: '/api/reputation/reviews',
          params,
        }),
      ]).then(() => {
        this.props.setReputationFilterState();
        this.setState({
          loaded: true,
        });
      }).catch(() => {
        this.setState({
          hasAccount: false,
          activationText: 'Activate Reviews/Reputation Management package or contact your CareCru account manager for further assistance.',
        });
      });
    }
  }

  submitDate(values) {
    this.setState({
      loaded: false,
    });

    const params = {
      startDate: moment(values.startDate)._d,
      endDate: moment(values.endDate)._d,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'reviews',
        url: '/api/reputation/reviews',
        params,
      }),
    ]).then(() => {
      const newState = {
        startDate: moment(values.startDate),
        endDate: moment(values.endDate),
        loader: true,
      };
      this.setState(newState);
    });
  }

  renderInnerContent() {
    const {
      reviews,
      reviewsFilter,
      setReputationFilter,
      reset,
      change,
    } = this.props;

    if (!reviews) {
      return <Loader inContainer={true}/>;
    }

    const reviewsData = reviews.get('data').toJS();
    const reviewsList = reviews.get('reviews').toJS();

    const filterSources = reviewsFilter.get('sources').toJS();
    const filterRatings = reviewsFilter.get('ratings').toJS();

    let constructBigComment = reviewsList;

    constructBigComment = constructBigComment.filter((review) => {
      if (filterSources.indexOf(review.sourceName) > -1) {
        return review;
      }
    });

    constructBigComment = constructBigComment.filter((review) => {
      if (filterRatings.indexOf(review.rating) > -1) {
        return review;
      }
    });

    constructBigComment = constructBigComment.map((review) => {
      return {
        icon: review.sourceName,
        publishedDate: review.publishedDateTime,
        headerLinkName: review.reviewerName,
        headerLinkSite: review.domain,
        siteStars: parseInt(review.rating),
        siteTitle: review.title,
        sitePreview: review.contentSnippet,
        iconColor: '#ffffff',
        background: '#395998',
        iconAlign: 'flex-end',
        requiredAction: 'ACTION REQUIRED',
        url: review.url,
        reviewerUrl: review.reviewerUrl,
      };
    });

    const filters = [
      {
        title: 'sources',
        items: [
          { type: 'checkbox', value: 'CareCru' },
          { type: 'checkbox', value: 'Google Maps' },
          { type: 'checkbox', value: 'Yelp' },
          { type: 'checkbox', value: 'Facebook' },
          { type: 'checkbox', value: 'Rate MDs' },
        ],
      },
      {
        title: 'ratings',
        items: [
          { type: 'checkbox', value: '1 Star' },
          { type: 'checkbox', value: '2 Star' },
          { type: 'checkbox', value: '3 Star' },
          { type: 'checkbox', value: '4 Star' },
          { type: 'checkbox', value: '5 Star' },
          { type: 'checkbox', value: 'No Rating' },
        ],
      },
    ];

    const initialValues = {
      sources: {
        'CareCru': true,
        'Google Maps': true,
        Yelp: true,
        Facebook: true,
        'Rate MDs': true,
      },

      ratings: {
        '1 Star': true,
        '2 Star': true,
        '3 Star': true,
        '4 Star': true,
        '5 Star': true,
        'No Rating': true,
      }
    };

    return (
      <Grid className={styles.reviews}>
        <Row className={styles.reviews__wrapper}>
          {/* <Col className={styles.padding} xs={12} md={12}>
            <GoogleMapsVideo />
          </Col>*/}

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <AverageRating count={reviewsData.industryAverageRating} rating={reviewsData.ratingCounts} />
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
            <Card className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} > {reviewsData.totalCount} </span>
                <span className={styles.stats__title} >Total Reviews</span>
                <div className={styles.stats__rating}>
                  {reviewsData.ratingCounts['0'] || '0'} with no star rating
                </div>
                <span className={styles.stats__bottom}>
                  Industry Average {reviewsData.industryAverageCount}
                </span>
              </div>
            </Card>
          </Col>
          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <RatingsChart rating={reviewsData.ratingCounts} />
          </Col>
          {/* <Col className={styles.padding} xs={12} md={12}>
            <Tags />
          </Col> */}
          <Row className={styles.rowReviewsFilter}>
            <Col Col style={{ paddingLeft: '10px' }} xs={12} md={8} sm={9} lg={9}>
              <ReviewsCard
                data={constructBigComment}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                submitDate={this.submitDate}
              />
            </Col>
            <Col style={{paddingLeft: '10px', paddingRight: '10px'}} xs={12} md={4} sm={3} lg={3}>
              <Filters
                key="reviewsFilter"
                setReputationFilter={setReputationFilter}
                filterKey="reviewsFilter"
                reset={reset}
                filters={filters}
                initialValues={initialValues}
                change={change}
              />
            </Col>
          </Row>
        </Row>
      </Grid>
    );
  }

  render() {
    if (!this.state.hasAccount) {
      return <ReputationDisabled activationText={this.state.activationText} />;
    }
    return this.renderInnerContent();
  }
}

Reviews.propTypes = {
  reviews: PropTypes.object.isRequired,
  activeAccount: PropTypes.object.isRequired,
  fetchEntitiesRequest: PropTypes.func,
};

function mapStateToProps({ apiRequests, entities, auth, reputation }) {
  const reviews = (apiRequests.get('reviews') ? apiRequests.get('reviews').data : null);
  const reviewsFilter = (apiRequests.get('reviews') ? reputation.get('reviewsFilter') : null);
  return {
    reviews,
    reviewsFilter,
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
    setReputationFilter,
    setReputationFilterState,
    reset,
    change,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Reviews);
