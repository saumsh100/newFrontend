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

    const {
      listings,
    } = this.props;

    if (!listings) {
      return null;
    }

    const listingsData = listings.get('data').toJS();
    console.log(listingsData);

    const scoreData = [
      { title: 'Industry Average', count: listingsData.listingPointScore.industryAverage },
      { title: 'Industry Leaders Average', count: listingsData.listingPointScore.industryLeadersAverage },
    ];

    const totalData = [
      { icon: 'check', title: 'Accurate', count: listingsData.sourcesFound },
      { icon: 'exclamation', title: 'Found with Possible Errors', count: listingsData.sourcesNotFound },
      { icon: 'times', title: 'Not Found', count: listingsData.sourcesFoundWithErrors },
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
        }] }];


    const filters = [
      {
        title: 'Sources',
        items: [
          { type: 'checkbox', value: 'Search Engines (2)' },
          { type: 'checkbox', value: 'Review Sites (4)' },
          { type: 'checkbox', value: 'Derictories (8)' },
          { type: 'checkbox', value: 'Sorial Sites (6)' },
        ],
      },
      {
        title: 'Sources',
        items: [
          { type: 'checkbox', value: 'Accurate (3)' },
          { type: 'checkbox', value: 'Friends with possible errors (2)' },
          { type: 'checkbox', value: 'Respond (15)' },
        ],
      },
    ];

    return (
      <Grid className={styles.listings}>
        <Row>
          <Col className={styles.padding} xs={12} md={3}>
            <Score
              borderColor={colorMap.blue}
              title="Listing Score"
              data={scoreData}
              listingScore={listingsData.listingScore}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={4}>
            <Total
              borderColor={colorMap.blue}
              title="Listing Score"
              data={totalData}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={5}>
            <Information
              borderColor={colorMap.blue}
              title="Listing Score"
              data={informationData}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={9}>
            <Table
              borderColor={colorMap.blue}
              cardTitle="Search Engines"
              data={hardcodeTableData}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={3}>
            <Filters filters={filters} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Listings;
