import React, { Component } from 'react';
import moment from 'moment';
import { Col, Grid, Row, Filters } from '../../library';
import colorMap from '../../library/util/colorMap';
import ReviewsCard from './Cards/ReviewsCard';
import styles from './styles.scss';

class Practice extends Component {
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
        title: 'Date Range',
        items: [
          { type: 'select', options: ['options1', 'options2', 'options3', 'options4'] },
        ],
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
          { type: 'select', options: ['Select Response Status', 'options1', 'options3', 'options4'] },
          { type: 'select', options: ['Select Shared Status', 'options1', 'options3', 'options4'] },
          { type: 'select', options: ['Select Publishing Status', 'options1', 'options3', 'options4'] },
          { type: 'checkbox', value: 'With Comments' },
          { type: 'checkbox', value: 'Without Comments' },
          { type: 'checkbox', value: 'With new Comments' },
          { type: 'checkbox', value: 'Without new Comments' },
        ],

      },
    ];


    return (
      <Grid className={styles.listing}>
        <Row>
          <Col className={styles.padding} xs={12} sm={7} md={12}>
            <ReviewsCard data={DataBigComment} />
          </Col>
          <Col className={styles.padding} xs={12} md={4}>
            <Filters filters={filters} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Practice;
