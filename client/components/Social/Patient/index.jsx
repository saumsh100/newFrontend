import React, { Component } from 'react';
import moment from 'moment';
import { Col, Grid, Row, Filters } from '../../library';
import colorMap from '../../library/util/colorMap';
import ReviewsCard from './Cards/ReviewsCard';
import styles from './styles.scss';

class Patient extends Component {
  render() {
    const DataBigComment = [{
      doubleIcon: { 
        smallIcon: { icon: 'facebook', iconColor: '#ffffff', background: colorMap.facebookBlue, iconAlign: 'center' },
        bigIcon: { src: "http://previews.123rf.com/images/glopphy/glopphy1209/glopphy120900011/15168826-Tooth-stylized-with-shadows-vector-Stock-Vector-tooth-dental-logo.jpg" }
      },
      headerLinkName: 'S. Lalala',
      headerLinkSite: 'yelp.ca',
      siteStars: 4,
      siteTitle: 'Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.',
      sitePreview: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      createdAt: moment().subtract(10, 'days').fromNow(),
      comments: [{
        imageSrc: 'https://placeimg.com/80/80/animals',
        userName: 'Scott Bell',
        message: 'Discounted cleanup?',
        sentAt: moment()._d,
      }],
    }, {

      doubleIcon: { 
        smallIcon: { icon: 'twitter', iconColor: '#ffffff', background: colorMap.primaryBlue, iconAlign: 'center' },
        bigIcon: { src: "http://previews.123rf.com/images/glopphy/glopphy1209/glopphy120900011/15168826-Tooth-stylized-with-shadows-vector-Stock-Vector-tooth-dental-logo.jpg" }
      },
      headerLinkName: 'L. Linda',
      headerLinkSite: 'yelp.ca',
      siteStars: 6,
      siteTitle: 'Lorem Ipsum is simply dummy text of theeMaker including versions of Lorem Ipsum.',
      sitePreview: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheetscontaining Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      createdAt: moment().subtract(10, 'days').fromNow(),
      comments: [{
        imageSrc: 'https://placeimg.com/80/80/animals',
        userName: 'Monica Lee',
        message: 'Congrats!',
        sentAt: moment()._d,
      },
      {
        imageSrc: 'https://placeimg.com/80/80/animals',
        userName: 'Kaiya Bush',
        message: 'Can you post a reminder before the launch day?',
        sentAt: moment()._d,
      }],
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
    const headerTabs = [{
      icon: 'facebook',
      color: 'facebookBlue',
      company: 'ABC Dental Care',
    }, {
      icon: 'twitter',
      color: 'lightBlue',
      company: 'ABCCare',
    }, {
      icon: 'facebook',
      color: 'facebookBlue',
      company: 'ABC Dental Care',
    }];
    const socialPreview = [{
      company: 'Facebook',
      message: 'Have you heard about our new Teeth Whitening Promotion?',
      image: '/images/dental.png',
    }, {
      company: 'Twitter',
      message: 'Have you heard about our new Teeth Whitening Promotion?',
      image: '/images/dental.png',
    }];
    return (
      <Grid className={styles.reviews}>
        <Row>
          <Col className={styles.padding} xs={12} md={12} sm={7}>
            <ReviewsCard
              data={DataBigComment}
              headerTabs={headerTabs}
              socialPreview={socialPreview}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4} sm={5}>
            <Filters filters={filters} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Patient;
