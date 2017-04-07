import React, { Component } from 'react';
import moment from 'moment';
import { Col, Grid, Row, Filters, Calendar } from '../../library';
import colorMap from '../../library/util/colorMap';
import ReviewsCard from './Cards/ReviewsCard';
import styles from './styles.scss';

import { DateUtils } from 'react-day-picker';

class Patient extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedDay: moment()._d };
  }

  render() {
    const DataBigComment = [{
      doubleIcon: {
        smallIcon: { icon: 'facebook', iconColor: '#ffffff', background: colorMap.facebookBlue, iconAlign: 'center' },
        bigIcon: { src: "http://previews.123rf.com/images/glopphy/glopphy1209/glopphy120900011/15168826-Tooth-stylized-with-shadows-vector-Stock-Vector-tooth-dental-logo.jpg" }
      },
      actions: true,
      headerLinkName: 'S. Lalala',
      headerLinkSite: 'yelp.ca',
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
        smallIcon: { icon: 'twitter', iconColor: '#ffffff', background: colorMap.lightBlue, iconAlign: 'center' },
        bigIcon: { src: "http://previews.123rf.com/images/glopphy/glopphy1209/glopphy120900011/15168826-Tooth-stylized-with-shadows-vector-Stock-Vector-tooth-dental-logo.jpg" }
      },
      actions: true,
      headerLinkName: 'L. Linda',
      headerLinkSite: 'yelp.ca',
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
      doubleIcon: {
        smallIcon: { icon: 'twitter', iconColor: '#ffffff', background: colorMap.lightBlue, iconAlign: 'center' },
        bigIcon: { src: "http://previews.123rf.com/images/glopphy/glopphy1209/glopphy120900011/15168826-Tooth-stylized-with-shadows-vector-Stock-Vector-tooth-dental-logo.jpg" }
      },
      actions: true,
      headerLinkName: 'N. Blabla',
      headerLinkSite: 'yelp.ca',
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
          <Col className={styles.padding} xs={12} md={8}>
            <ReviewsCard
              data={DataBigComment}
              headerTabs={headerTabs}
              socialPreview={socialPreview}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4}>
            <Filters filters={filters} />


            <Calendar
              className={styles.calendar}
              initialMonth={new Date(2016, 1)}
              selectedDays={this.state.selectedDays}
            />

          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Patient;
