
import React, { PropTypes } from 'react';
import { withState, compose } from 'recompose';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '../library';
import { Card, CardBlock, CardTitle, CardSubtitle, CardText, CardLink } from 'reactstrap';
import Listings from '../Listings';
import Reviews from '../Reviews';
import styles from './styles.scss';
import fetchReputationData from '../../thunks/fetchReputationData';
import CardHoc from './cardHoc'

// wrap components with hoc's
const ListingsCard = CardHoc(Listings)
const ReviewsCard = CardHoc(Reviews)

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchReputationData();
  }

  renderCards() {
    const {
      listingCount,
      errorCount,
      missingCount,
      lastFetched,
      status,
      fetchReputationData,
    } = this.props;
    
    return (
      <div >
        <ListingsCard
          title={'Listings'}
          listingCount={listingCount}
          errorCount={errorCount}
          missingCount={missingCount}
          status={status}
          lastFetched={lastFetched}
          reload={fetchReputationData}
        />

        // TODO: for now connect Reviews card to Listings card props until its api integration
        <ReviewsCard
          title={'Reviews'}
          status={status}
          lastFetched={lastFetched}
          reload={fetchReputationData}
        />
      </div>
    );
  }

  render() {
    return (
      <div style={{ padding: '20px' }}>
        {this.renderCards()}
      </div>
    );
  }
}

function mapStateToProps({ reputation }) {
  return {
    lastFetched: reputation.get('lastFetched'),
    status: reputation.get('status'),
    listingCount: reputation.getIn(['data', 'sourcesFound']),
    errorCount: reputation.getIn(['data', 'sourcesFoundWithErrors']),
    missingCount: reputation.getIn(['data', 'sourcesNotFound']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchReputationData,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);
