
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { reset, change } from 'redux-form';
import { bindActionCreators } from 'redux';
import Loader from '../../Loader';
import { Col, Grid, Row, Filters } from '../../library';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import { setReputationFilter } from '../../../actions/reputation';
import colorMap from '../../library/util/colorMap';
import Score from './Cards/Score';
import Total from './Cards/Total';
import Information from './Cards/Information';
import Table from './Cards/Table';
import styles from './styles.scss';
import ReputationDisabled from '../ReputationDisabled';

function generateSearchData(entityList, statuses) {
  return entityList
    .filter((entity) => {
      if (statuses.length) {
        const listings = entity.listings;
        let accurateListing = 'Not Found';
        if (listings.length) {
          accurateListing = 'Accurate';
          const warning = listings[0].anchorDataWarningFlag;

          if (warning) {
            accurateListing = 'Found with Possible Errors';
          }
        }
        if (statuses.indexOf(accurateListing) > -1) {
          return entity;
        }
      }
    })
    .map(entity => ({
      img: entity.iconUrl,
      name: entity.sourceName,
      listing: entity.listings,
    }));
}

class Listings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      hasAccount: false,
      activationText: '',
    };
  }

  componentWillMount() {
    const { activeAccount } = this.props;

    let hasAccount = false;

    if (
      activeAccount.get('vendataId') ||
      activeAccount.get('vendastaId') !== ''
    ) {
      hasAccount = true;
    }

    this.setState({
      hasAccount,
    });
  }

  componentDidMount() {
    if (this.state.hasAccount) {
      const params = {
        startDate: moment().subtract(30, 'days')._d,
        endDate: moment()._d,
      };

      Promise.all([
        this.props.fetchEntitiesRequest({
          id: 'listings',
          url: '/api/reputation/listings',
        }),
      ])
        .then(() => {
          this.setState({
            loaded: true,
          });
        })
        .catch(() => {
          this.setState({
            hasAccount: false,
            activationText:
              'Activate Listings/Reputation Management package or contact your CareCru account manager for further assistance.',
          });
        });
    }
  }

  render() {
    const {
      listings,
      reset,
      setReputationFilter,
      listingsFilter,
      change,
    } = this.props;

    if (!this.state.hasAccount) {
      return <ReputationDisabled activationText={this.state.activationText} />;
    }

    if (!listings) {
      return <Loader inContainer />;
    }

    const listingsData = listings.get('data').toJS();
    const getInfo = listings.get('accountInfo').toJS();
    const listingsAcctInfo = getInfo[Object.keys(getInfo)[0]];

    const scoreData = [
      {
        title: 'Industry Average',
        count: listingsData.listingPointScore.industryAverage,
      },
      {
        title: 'Industry Leaders Average',
        count: listingsData.listingPointScore.industryLeadersAverage,
      },
    ];

    const totalData = [
      { icon: 'check', title: 'Accurate', count: listingsData.sourcesFound },
      {
        icon: 'exclamation',
        title: 'Found with Possible Errors',
        count: listingsData.sourcesFoundWithErrors,
      },
      { icon: 'times', title: 'Not Found', count: listingsData.sourcesNotFound },
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
    console.log(listingsSearchData);
    const filterData = listingsFilter.toJS();

    const tableData2 = [];

    if (filterData.sourceTypes.length) {
      filterData.sourceTypes.map((lf) => {
        if (lf === 'Search Engines') {
          tableData2.push({
            title: 'Search Engines',
            data: generateSearchData(
              listingsSearchData.searchengines,
              filterData.listingStatuses,
            ),
          });
        }
        if (lf === 'Review Sites') {
          tableData2.push({
            title: 'Review Sites',
            data: generateSearchData(
              listingsSearchData.reviewengines,
              filterData.listingStatuses,
            ),
          });
        }
        if (lf === 'Directories') {
          tableData2.push({
            title: 'Directories',
            data: generateSearchData(
              listingsSearchData.directories,
              filterData.listingStatuses,
            ),
          });
        }
        if (lf === 'Social Sites') {
          tableData2.push({
            title: 'Social Sites',
            data: generateSearchData(
              listingsSearchData.socialengines,
              filterData.listingStatuses,
            ),
          });
        }
      });
    }

    const filters = [
      {
        title: 'Source Type',
        items: [
          { type: 'checkbox', value: 'Search Engines' },
          { type: 'checkbox', value: 'Review Sites' },
          { type: 'checkbox', value: 'Directories' },
          { type: 'checkbox', value: 'Social Sites' },
        ],
      },
      {
        title: 'Listing Status',
        items: [
          { type: 'checkbox', value: 'Accurate' },
          { type: 'checkbox', value: 'Found with Possible Errors' },
          { type: 'checkbox', value: 'Not Found' },
        ],
      },
    ];

    const initialValues = {
      'Source Type': {
        'Search Engines': true,
        'Review Sites': true,
        Directories: true,
        'Social Sites': true,
      },
      'Listing Status': {
        Accurate: true,
        'Found with Possible Errors': true,
        'Not Found': true,
      },
    };

    return (
      <Grid className={styles.listings}>
        <Row>
          <Col className={styles.padding} xs={12} md={3}>
            <Score
              borderColor={colorMap.blue}
              title="Listing Score"
              data={scoreData}
              listingScore={listingsData.listingPointScore}
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
              cardTitle="Primary Listings"
              data={tableData2}
            />
          </Col>
          <Col className={styles.padding} xs={12} md={3}>
            <Filters
              key="listingsFilter"
              filters={filters}
              filterKey="listingsFilter"
              setReputationFilter={setReputationFilter}
              reset={reset}
              change={change}
              initialValues={initialValues}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

Listings.propTypes = {
  listings: PropTypes.object.isRequired,
  activeAccount: PropTypes.object.isRequired,
  fetchEntitiesRequest: PropTypes.func,
};

function mapStateToProps({
  apiRequests, entities, auth, reputation,
}) {
  const listings = apiRequests.get('listings')
    ? apiRequests.get('listings').data
    : null;
  const listingsFilter = apiRequests.get('listings')
    ? reputation.get('listingsFilter')
    : null;

  return {
    listings,
    listingsFilter,
    activeAccount: entities.getIn(['accounts', 'models', auth.get('accountId')]),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      reset,
      change,
      setReputationFilter,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);
export default enhance(Listings);
