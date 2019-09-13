
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import TopBar from '../components/TopBar';
import { setIsCollapsed } from '../actions/toolbar';
import { setIsSearchCollapsed } from '../reducers/toolbar';
import { logout, switchActiveAccount } from '../thunks/auth';
import runOnDemandSync from '../thunks/runOnDemandSync';
import { fetchEntities } from '../thunks/fetchEntities';
import { accountShape } from '../components/library/PropTypeShapes';

class TopBarContainer extends Component {
  componentDidMount() {
    this.props.fetchEntities({
      key: 'accounts',
      url: '/api/accounts',
    });
    this.preloadLogoImage = new Image();
    this.preloadLogoImage.src = '/images/carecru_logo.png';
  }

  render() {
    return this.props.isReady && <TopBar {...this.props} />;
  }
}

TopBarContainer.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  setIsSearchCollapsed: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.shape(accountShape)),
  activeAccount: PropTypes.shape(accountShape),
  isReady: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ entities, toolbar, auth, featureFlags }) => {
  const activeAccount = entities.getIn(['accounts', 'models', auth.get('accountId')]);
  const accountsFlag = featureFlags.getIn(['flags', 'multi-account-select']);
  const allowedAccounts = accountsFlag && accountsFlag.toJS().map(a => a.value);
  const enterpriseAccounts = Object.values(
    entities
      .getIn(['accounts', 'models'])
      .filter(account => account.enterpriseId === auth.get('enterpriseId'))
      .toJS(),
  );

  // If the feature flag is an array, we ensure we are only showing those practices
  const accounts = allowedAccounts
    ? enterpriseAccounts.filter(a => allowedAccounts.indexOf(a.id) > -1)
    : enterpriseAccounts;

  return {
    isCollapsed: toolbar.get('isCollapsed'),
    isSearchCollapsed: toolbar.get('isSearchCollapsed'),
    activeAccount: activeAccount && activeAccount.toJS(),
    accounts,
    user: auth.get('user'),
    enterprise: auth.get('enterprise'),
    isReady: !!auth.get('accountId') && !!activeAccount,
  };
};

const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      setIsCollapsed,
      setIsSearchCollapsed,
      logout,
      runOnDemandSync,
      fetchEntities,
      switchActiveAccount,
      push,
    },
    dispatch,
  );

TopBarContainer.defaultProps = {
  accounts: [],
  activeAccount: null,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(TopBarContainer);
