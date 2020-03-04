
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import TopBar from '../components/TopBar';
import { setIsCollapsed } from '../actions/toolbar';
import { setIsSearchCollapsed } from '../reducers/toolbar';
import { logout, switchActiveAccount } from '../thunks/auth';
import runOnDemandSync from '../thunks/runOnDemandSync';
import { fetchEntities } from '../thunks/fetchEntities';
import { accountShape } from '../components/library/PropTypeShapes';

class TopBarContainer extends Component {
  componentDidMount() {
    Promise.all([
      this.props.fetchEntities({ url: `/api/accounts/${this.props.authAccountId}/users` }),
      this.props.fetchEntities({ key: 'accounts',
        join: ['weeklySchedule'] }),
      this.props.fetchEntities({
        key: 'accounts',
        url: '/api/accounts',
      }),
    ]);

    this.preloadLogoImage = new Image();
    this.preloadLogoImage.src = '/images/carecru_logo.png';
  }

  render() {
    return this.props.isReady && <TopBar {...this.props} />;
  }
}

TopBarContainer.propTypes = {
  isReady: PropTypes.bool,
  isCollapsed: PropTypes.bool.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  setIsSearchCollapsed: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.shape(accountShape)),
  activeAccount: PropTypes.shape(accountShape),
  authAccountId: PropTypes.string.isRequired,
};

const mapStateToProps = ({ entities, toolbar, auth, featureFlags }) => {
  const authAccountId = auth.get('accountId');
  const activeAccount = entities.getIn(['accounts', 'models', authAccountId]);
  const accountsFlag = featureFlags.getIn(['flags', 'accounts-available-to-switch']);
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
    accounts,
    authAccountId,
    isCollapsed: toolbar.get('isCollapsed'),
    isSearchCollapsed: toolbar.get('isSearchCollapsed'),
    activeAccount: activeAccount && activeAccount.toJS(),
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
  isReady: false,
  activeAccount: null,
};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(TopBarContainer);
