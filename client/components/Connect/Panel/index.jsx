
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { startSync, stopSync } from '../../../thunks/connect';
import {
  ProgressBar,
  Icon,
  Link,
  Grid,
  Row,
  Col,
  VButton,
} from '../../library';
import styles from './styles.scss';

const collectionOrder = [
  'chairs',
  'practitioners',
  'families',
  'patients',
  'appointments',
];

const collectionWeights = [
  10,
  10,
  20,
  30,
  30,
];

const getPercentageFromProgress = (progress) => {
  const { collection, saved, total } = progress;
  const ii = collectionOrder.indexOf(collection);
  const collectionWeight = collectionWeights[ii];
  const weightSoFar = collectionWeights.slice(0, ii).reduce((a, b) => a + b, 0);
  return weightSoFar + (saved / total) * collectionWeight;
};

class Panel extends Component {
  constructor(props) {
    super(props);

    this.startSync = this.startSync.bind(this);
  }

  startSync() {
    this.props.startSync()
      .then(() => this.props.history.push('./progress'));
  }

  render() {
    const { account } = this.props;
    if (!account) return null;

    return (
      <div>
        <div className={styles.subHeader}>
          All systems are go captain! Click the button below to start the sync.
        </div>
        <VButton
          color="dark"
          className={styles.btn}
          onClick={this.startSync}
        >
          Start Sync
        </VButton>
      </div>
    );
  }
}

Panel.propTypes = {
  isSyncing: PropTypes.bool.isRequired,
  account: PropTypes.object,
  progress: PropTypes.object,
};

function mapStateToProps({ entities, auth, connect }) {
  // Return activeAccount model
  return {
    account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    isSyncing: connect.get('isSyncing'),
    progress: connect.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    startSync,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Panel));
