
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
    } = this.props;
    
    return (
      <div >
        <Card className={styles.cardContainer}>
          <CardBlock>
            <CardTitle>
              <Link to="/reputation">Listings</Link>
            </CardTitle>
          </CardBlock>
          <CardBlock>
            <Listings
              listingCount={listingCount}
              errorCount={errorCount}
              missingCount={missingCount}
            />
          </CardBlock>
          <CardBlock style={{ padding: '20px'}}>
            Last Fetched on {lastFetched}
          </CardBlock>
        </Card>
        <Card className={styles.cardContainer}>
          <CardBlock>
            <CardTitle>
              <Link to="/reputation">Reviews</Link>
            </CardTitle>
          </CardBlock>
          <CardBlock>
            <Reviews />
          </CardBlock>
        </Card>
      </div>
    );
  }

  render() {
    return (
      <div style={{ padding: '20px' }}>
        {this.props.status === 'loading' ? 'Loading' : this.renderCards()}
      </div>
    );
  }
}

function mapStateToProps({ reputation }) {
  const {
    sourcesFound,
    sourcesFoundWithErrors,
    sourcesNotFound,
  } = reputation.get('data');
  
  return {
    lastFetched: reputation.get('lastFetched'),
    status: reputation.get('status'),
    listingCount: sourcesFound,
    errorCount: sourcesFoundWithErrors,
    missingCount: sourcesNotFound,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchReputationData,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Dashboard);
