
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

class Progress extends Component {
  constructor(props) {
    super(props);

    this.stopSync = this.stopSync.bind(this);
  }

  stopSync() {
    this.props.stopSync();
  }

  render() {
    const { account, isSyncing, progress, isDone } = this.props;
    if (!account) return null;

    let percentage = 0;
    if (progress) {
      percentage = getPercentageFromProgress(progress);
    }

    if (isDone) {
      percentage = 100;
    }

    let syncingText = 'Waiting for connection';
    let classes = `${styles.progressText} ${styles.loading}`;
    if (progress) {
      syncingText = `Syncing ${progress.collection}`;
    }

    if (isDone) {
      classes = styles.progressText;
      syncingText = 'Done.'
    }

    return (
      <div>
        <div className={classes}>
          {syncingText}
        </div>
        <ProgressBar percentage={percentage} />
      </div>
    );
  }
}

Progress.propTypes = {
  isSyncing: PropTypes.bool.isRequired,
  account: PropTypes.object,
  progress: PropTypes.object,
};

function mapStateToProps({ entities, auth, connect }) {
  // Return activeAccount model
  return {
    account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    isSyncing: connect.get('isSyncing'),
    isDone: connect.get('isDone'),
    progress: connect.get('progress'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    startSync,
    stopSync,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Progress));
