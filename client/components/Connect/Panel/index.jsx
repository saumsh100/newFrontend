
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
    this.stopSync = this.stopSync.bind(this);
  }

  startSync() {
    this.props.startSync();
  }

  stopSync() {
    this.props.stopSync();
  }

  render() {
    const { account, isSyncing, progress } = this.props;
    if (!account) return null;

    let percentage = 0;
    if (progress) {
      percentage = getPercentageFromProgress(progress);
    }

    let main = (
      <div className={styles.row}>
        <div>
          All systems are go captain!
        </div>
        <div>
          Click the button below to start the sync.
        </div>
      </div>
    );

    if (isSyncing) {
      main = (
        <div className={styles.row}>
          {progress && (percentage !== 100) ? <div>Syncing {progress.collection}... </div> : null}
          <ProgressBar percentage={percentage} />
        </div>
      );
    }

    let completed = null;
    if (!isSyncing && percentage === 100) {
      completed = (
        <div>
          You are now up and running! Head to the CareCru application to take the next
          steps <a target="_blank" href="https://carecru.io">here</a>.
        </div>
      );
    }

    return (
      <Grid className={styles.grid}>
        {main}
        {completed}
        <Row className={styles.row}>
          <Col className={styles.col} xs={12}>
            <VButton
              color={isSyncing ? 'darkgrey' : 'dark'}
              className={styles.btn}
              onClick={this.startSync}
              disabled={isSyncing}
            >
              {isSyncing ? 'Syncing...' : 'Start Sync'}
            </VButton>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={6} className={styles.col}>
            <Link to="./settings">
              <VButton className={styles.btn}>
                <Icon icon="arrow-left" /> Settings
              </VButton>
            </Link>
          </Col>
          <Col xs={6} className={styles.col}>
            <VButton
              color="red"
              className={styles.btn}
              onClick={this.stopSync}
            >
              Stop Sync
            </VButton>
          </Col>
        </Row>
      </Grid>
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
    stopSync,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Panel));
