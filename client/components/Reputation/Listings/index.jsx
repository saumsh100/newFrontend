import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loader';
import { Col, Grid, Row, Filters } from '../../library';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import colorMap from '../../library/util/colorMap';
import Score from './Cards/Score';
import Total from './Cards/Total';
import Information from './Cards/Information';
import Table from './Cards/Table';
import styles from './styles.scss';

function generateSearchData(entityList) {
  return entityList.map((entity) => {
    return {
      img: entity.iconUrl,
      name: entity.sourceName,
      listings: entity.listings.length,
    };
  });
}

class Listings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount(){
    // can change range
    const params = {
      startDate: moment().subtract(30, 'days')._d,
      endDate: moment()._d,
    };

    Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'listings',
        url: '/api/reputation/listings',
        params,
      }),
    ]).then(() => {
      this.setState({
        loaded: true,
      });
    });
  }

  render() {
    const {
      listings,
    } = this.props;

    if (!listings) {
      return null;
    }

    const listingsData = listings.get('data').toJS();
    const getInfo = listings.get('accountInfo').toJS();
    const listingsAcctInfo = getInfo[Object.keys(getInfo)[0]]


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
      { title: 'Business Name', data: listingsAcctInfo.companyName },
      { title: 'Street Address', data: listingsAcctInfo.address },
      { title: 'City', data: listingsAcctInfo.city },
      { title: 'State / Prov / Region ', data: listingsAcctInfo.state },
      { title: 'Zip / Postal Code', data: listingsAcctInfo.zip },
      { title: 'Phone', data: listingsAcctInfo.workNumber },
      { title: 'Website', data: listingsAcctInfo.website },
    ];


    const listingsSearchData = listings.get('searchData').toJS();

    const tableData = [{
      data: generateSearchData(listingsSearchData.searchengines),
    }, {
      title: 'Review Sites',
      data: generateSearchData(listingsSearchData.reviewengines),
    }, {
      title: 'Social Sites',
      data: generateSearchData(listingsSearchData.socialengines),
    },
    ];

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
      <div>
        <Loader loaded={this.state.loaded} color="#FF715A">
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
              <Col className={styles.padding} xs={12} md={12}>
                <Table
                  borderColor={colorMap.blue}
                  cardTitle="Search Engines"
                  data={tableData}
                />
              </Col>
              {/*<Col className={styles.padding} xs={12} md={3}>
                <Filters filters={filters} />
              </Col>*/}
            </Row>
          </Grid>
        </Loader>
      </div>
    );
  }
}

function mapStateToProps({ apiRequests }) {
  const listings = (apiRequests.get('listings') ? apiRequests.get('listings').data : null);

  return {
    listings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);
export default enhance(Listings);
