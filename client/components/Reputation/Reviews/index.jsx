import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { Card, Col, Grid, Row, Filters } from '../../library';
import colorMap from '../../library/util/colorMap';
import GoogleMapsVideo from './Cards/GoogleMapsVideo';
import AverageRating from './Cards/AverageRating';
import RatingsChart from './Cards/RatingsChart';
import ReviewsCard from './Cards/ReviewsCard';
import Tags from './Cards/Tags';
import styles from './styles.scss';

class Reviews extends Component {
  render() {
    const {
      reviews,
    } = this.props;

    const reviewsData = reviews.get('data').toJS();

    const reviewsList = reviews.get('reviews').toJS();

    const contructBigComment = reviewsList.map((review) => {
      const publishedDate = moment(review.publishedDateTime);
      const today = moment();
      const duration = moment.duration(today.diff(publishedDate));
      const days = duration.asDays();

      return {
        icon: review.sourceName,
        createdAt: Math.ceil(days),
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
        title: 'Date Range',
        items: [
          {type: 'select', name: 'opt1', options: [{ value: 'options1' }, { value: 'options2' }, { values: 'options3' }, { value: 'options4' },]}
        ]
      }, {
        title: 'Sources',
        items: [
          { type: 'checkbox', value: 'Google Maps (5)' },
          { type: 'checkbox', value: 'Yelp (4)' },
          { type: 'checkbox', value: 'Facebook (3)' },
        ],
      }, {
        title: 'Rating',
        items: [
          { type: 'checkbox', value: '1 Star' },
          { type: 'checkbox', value: '2 Star' },
          { type: 'checkbox', value: '3 Star' },
          { type: 'checkbox', value: '4 Star' },
          { type: 'checkbox', value: '5 Star' },
          { type: 'checkbox', value: 'No Rating' },
        ],
      },
      {
        title: 'Status',
        items: [
          {type: 'select', name: 'opt2', options: [{ value: 'Select Response Status' }, { value: 'options1' }, { value: 'options3' }, { value: 'options4' }]},
          {type: 'select', name: 'opt3', options: [{ value: 'Select Response Status' }, { value: 'options1' }, { value: 'options3' }, { value: 'options4' }]},
          {type: 'select', name: 'opt4', options: [{ value: 'Select Response Status' }, { value: 'options1' }, { value: 'options3' }, { value: 'options4' }]},
          {type: 'checkbox', value: 'With Comments'},
          {type: 'checkbox', value: 'Without Comments'},
          {type: 'checkbox', value: 'With new Comments'},
          {type: 'checkbox', value: 'Without new Comments'},
        ]
      }
    ];


    return (
      <Grid className={styles.reviews}>
        <Row className={styles.reviews__wrapper}>
          <Col className={styles.padding} xs={12} md={12}>
            <GoogleMapsVideo />
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <AverageRating count={reviewsData.industryAverageRating} />
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
            <Card className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} > {reviewsData.totalCount} </span>
                <span className={styles.stats__title} >Total Reviews</span>
                <div className={styles.stats__rating}>
                  {reviewsData.ratingCounts['0'] || '0'} With no start rating
                </div>
                <span className={styles.stats__bottom}>Industry Average {reviewsData.industryAverageCount} </span>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <RatingsChart rating={reviewsData.ratingCounts} />
          </Col>
          {/*<Col className={styles.padding} xs={12} md={12}>
            <Tags />
          </Col>*/}
          <Row className={styles.rowReviewsFilter}>
            <Col className={styles.padding} xs={12} md={12} sm={12} lg={12}>
              <ReviewsCard data={contructBigComment} />
            </Col>
            {/*<Col className={styles.padding} xs={12} md={4} sm={3} lg={3}>
              <Filters filters={filters} />
            </Col>*/}
          </Row>
        </Row>
      </Grid>
    );
  }
}

export default Reviews;
