
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

class Completed extends Component {
  constructor(props) {
    super(props);

    this.stopSync = this.stopSync.bind(this);
  }

  stopSync() {
    this.props.stopSync();
  }

  render() {
    const { account } = this.props;
    if (!account) return null;

    const { origin, protocol } = window.location;
    const split = origin.split('.');
    const url = `${protocol}//${split[1]}.${split[2]}/intelligence`;
    const dashboardLink = (
      <a href={url} target="_blank">
        here
      </a>
    );

    return (
      <div>
        <div className={styles.logoWrapper}>
          <img
            className={styles.logo}
            src="/images/carecru_logo_collapsed_dark.png"
            alt="CareCru Logo"
          />
        </div>
        <div className={styles.header}>Congratulations!</div>
        <div className={styles.subHeader}>CareCru is now connected.</div>
        <div className={styles.subHeader}>
          Click {dashboardLink} to view your data in the dashboard.
        </div>
      </div>
    );
  }
}

Completed.propTypes = {
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
  return bindActionCreators(
    {
      startSync,
      stopSync,
    },
    dispatch,
  );
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Completed));
