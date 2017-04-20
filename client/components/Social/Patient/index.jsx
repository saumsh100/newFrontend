import React, { Component } from 'react';
import moment from 'moment';
import { Col, Grid, Row, Filters, Calendar } from '../../library';
import colorMap from '../../library/util/colorMap';
import ReviewsCard from './Cards/ReviewsCard';
import styles from './styles.scss';

class Patient extends Component {
  render() {
    const DataBigComment = [{
      icon: 'facebook',
      iconColor: '#ffffff',
      background: '#395998',
      iconAlign: 'flex-end',
      headerLinkName: 'S. Lalala',
      headerLinkSite: 'yelp.ca',
      siteStars: 4,
      siteTitle: 'Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.',
      sitePreview: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      createdAt: moment().subtract(10, 'days').fromNow(),
    }, {
      icon: 'bitcoin',
      iconColor: '#ffffff',
      background: '#ffc55b',
      iconAlign: 'center',
      headerLinkName: 'L. Linda',
      headerLinkSite: 'yelp.ca',
      siteStars: 6,
      siteTitle: 'Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.',
      sitePreview: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      createdAt: moment().subtract(10, 'days').fromNow(),
    }, {
      icon: 'twitter',
      iconColor: '#ffffff',
      background: '#FF715A',
      iconAlign: 'center',
      headerLinkName: 'N. Blabla',
      headerLinkSite: 'yelp.ca',
      siteStars: 3,
      siteTitle: 'Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.',
      sitePreview: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      createdAt: moment().subtract(10, 'days').fromNow(),
    }];

    const filters = [
      {
        title: 'Facebook',
        titleIcon: {
          color: colorMap.facebookBlue,
          icon: 'facebook',
        },
        items: [
          { type: 'checkbox', value: 'ADC Dental Care' },
          { type: 'checkbox', value: 'Carecru Dental Care' },
        ],
      }, {
        title: 'Twitter',
        titleIcon: {
          color: colorMap.lightBlue,
          icon: 'twitter',
        },
        items: [
          { type: 'checkbox', value: 'ADC Dental Care' },
        ],
      }, {
        title: 'Action Filter',
        items: [
          { type: 'checkbox', value: 'Avaiting Response' },
          { type: 'checkbox', value: 'Respond To' },
          { type: 'checkbox', value: 'Dismissed' },
        ],
      },
    ];


    return (
      <Grid className={styles.reviews}>
        <Row>
          <Col className={styles.padding} xs={12} sm={12} md={8} lg={8}>
            <ReviewsCard data={DataBigComment} />
          </Col>
          <Col className={styles.padding} xs={12} sm={4} md={4} lg={4}>
            <Row>
              <Col xs={12} >
                <Filters filters={filters} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={styles.calendarContainer}>
                <Calendar className={styles.calendarContainer_calendar} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Patient;
