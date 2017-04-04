import React, { PropTypes, Component } from 'react';
import { Col, Grid, Row, Filters } from '../../library';
import colorMap from '../../library/util/colorMap';
import Score from './Cards/Score';
import Total from './Cards/Total';
import Information from './Cards/Information';
import Table from './Cards/Table';
import styles from './styles.scss';

class Listings extends Component {
  render() {
    const scoreData = [
      { title: 'Industry Avg', count: 404 },
      { title: 'Industry Avg', count: 404 },
    ];
    
    const totalData = [
      { icon: 'check', title: 'Accurate', count: 3 },
      { icon: 'exclamation', title: 'Found with Possible Errors', count: 2 },
      { icon: 'times', title: 'Not Found', count: 15 },
    ];

    const informationData = [
      { title: 'Business Name', data: 'ABC Dental Care' },
      { title: 'Street Address', data: 'East 2nd Ave' },
      { title: 'City', data: 'Vancouver' },
      { title: 'State / Prov / Region ', data: 'BC' },
      { title: 'Zip / Postal Code', data: 'V1B2C3' },
      { title: 'Phone', data: '123 456 7890' },
      { title: 'Website', data: 'https://www.abcdentalcare.com' },
    ];

    const hardcodeTableData = [{
      data:
        [{
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'lwater12@gmail.com',
          listing: 0,
        }, {
          img: '/images/services/voyager.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'emilee1@gmail.com',
          listing: 26,
        }, {
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'barlet@gmail.com',
          listing: 54,
        }] }, {
      title: 'Review Sites',
      data:
        [{
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'lwater12@gmail.com',
          listing: 0,
        }, {
          img: '/images/services/voyager.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'emilee1@gmail.com',
          listing: 26,
        }, {
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'barlet@gmail.com',
          listing: 0,
        }] }, {
      title: 'Review Sites',
      data:
        [{
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'lwater12@gmail.com',
          listing: 0,
        }, {
          img: '/images/services/voyager.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'emilee1@gmail.com',
          listing: 26,
        }, {
          img: '/images/services/google_maps.png',
          name: 'Google Maps',
          phone: '123 456 7890',
          email: 'barlet@gmail.com',
          listing: 0,
        }] }];

    const filters = [
      {
        title: 'Sources',
        items: [
          {type: 'checkbox', value: 'Search Engines (2)'},
          {type: 'checkbox', value: 'Review Sites (4)'},
          {type: 'checkbox', value: 'Derictories (8)'},
          {type: 'checkbox', value: 'Sorial Sites (6)'},
        ]
      },
      {
        title: 'Sources',
        items: [
          {type: 'checkbox', value: 'Accurate (3)'},
          {type: 'checkbox', value: 'Friends with possible errors (2)'},
          {type: 'checkbox', value: 'Respond (15)'},
        ]
      },
    ];

    return (
      <Grid className={styles.listings}>
        <Row>
          <Col className={styles.padding} xs={12} md={4}>
            <Score
              borderColor={colorMap.blue}
              title="Listing Score"
              data={scoreData}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4}>
            <Total
              borderColor={colorMap.blue}
              title="Listing Score"
              data={totalData}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4}>
            <Information
              borderColor={colorMap.blue}
              title="Listing Score"
              data={informationData}
            />
          </Col>
          <Col xs={12}>
            <Table
              borderColor={colorMap.blue}
              cardTitle="Search Engines"
              data={hardcodeTableData}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4} sm={5} lg={5}>
            <Filters filters={filters} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Listings;
