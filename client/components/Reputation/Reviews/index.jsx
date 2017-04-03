import React, { PropTypes, Component } from 'react';
import { Card, Col, Grid, Row, CardHeader, Star, Tag, BigCommentBubble, Checkbox } from '../../library';
import colorMap from '../../library/util/colorMap';
import GoogleMapsVideo from './Cards/GoogleMapsVideo';
import AverageRating from './Cards/AverageRating';
import RatingsChart from './Cards/RatingsChart';
import ReviewsCard from './Cards/ReviewsCard';
import Tags from './Cards/Tags';
import Filters from './Cards/Filters';
import styles from './styles.scss';
import _ from 'lodash';
import moment from 'moment';

class Reviews extends Component {
  render() {
    const rating = {
      5: 11,
      4: 0,
      3: 0,
      2: 0,
      1: 1,
    }

    const DataBigComment = [{
      icon: "facebook",
      iconColor: '#ffffff',
      background: '#395998',
      iconAlign: 'flex-end',
      headerLinkName: "S. Lalala",
      headerLinkSite: "yelp.ca",
      siteStars: 4,
      siteTitle: "Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.",
      sitePreview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: moment().subtract(10, 'days').fromNow()
    },{
      icon: "bitcoin",
      iconColor: '#ffffff',
      background: '#ffc55b',
      iconAlign: 'center',
      headerLinkName: "L. Linda",
      headerLinkSite: "yelp.ca",
      siteStars: 6,
      siteTitle: "Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.",
      sitePreview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: moment().subtract(10, 'days').fromNow()
    },{
      icon: "twitter",
      iconColor: '#ffffff',
      background: '#FF715A',
      iconAlign: 'center',
      headerLinkName: "N. Blabla",
      headerLinkSite: "yelp.ca",
      siteStars: 3,
      siteTitle: "Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.",
      sitePreview: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      createdAt: moment().subtract(10, 'days').fromNow()
    }];


    return (
      <Grid className={styles.reviews}>
        <Row>
          <Col className={styles.padding} xs={12} md={12}>
            <GoogleMapsVideo />
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <AverageRating />
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4}>
            <Card borderColor={colorMap.blue} className={styles.card}>
              <div className={styles.stats}>
                <span className={styles.stats__count} >12</span>
                <span className={styles.stats__title} >Average Rating</span>
                <div className={styles.stats__rating}>
                  0 With no start rating
                </div>
                <span className={styles.stats__bottom}>Industry Average 106</span>
              </div>
            </Card>
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={6} lg={4} >
            <RatingsChart rating={rating} />
          </Col>
          <Col className={styles.padding} xs={12} md={12}>
            <Tags />
          </Col>
          <Col className={styles.padding} xs={12} md={12} sm={7} lg={7}>
            <ReviewsCard data={DataBigComment} />
          </Col>

          <Col className={styles.padding} xs={12} md={4} sm={5} lg={5}>
            <Filters />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Reviews;
