import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import TopBar from '../components/TopBar';
import { setIsCollapsed, setIsHovered } from '../actions/toolbar';
import { setIsSearchCollapsed } from '../reducers/toolbar';
import { logout, switchActiveAccount } from '../thunks/auth';
import runOnDemandSync from '../thunks/runOnDemandSync';
import { fetchEntities } from '../thunks/fetchEntities';

class TopBarContainer extends PureComponent {
  componentDidMount() {
    Promise.all([
      this.props.fetchEntities({ url: `/api/accounts/${this.props.authAccountId}/users` }),
      this.props.fetchEntities({ key: 'accounts', join: ['weeklySchedule'] }),
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
  isSuperAdmin: PropTypes.bool,
  isCollapsed: PropTypes.bool.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  setIsSearchCollapsed: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
  activeAccountMap: PropTypes.instanceOf(Map),
  accountsFlagMap: PropTypes.instanceOf(Map).isRequired,
  enterpriseAccountsMap: PropTypes.instanceOf(Map).isRequired,
  authAccountId: PropTypes.string.isRequired,
};

TopBarContainer.defaultProps = {
  isReady: false,
  isSuperAdmin: false,
  activeAccountMap: null,
};

const mapStateToProps = ({ entities, toolbar, auth, featureFlags }) => {
  const userRole = auth.get('role');
  const isSuperAdmin = userRole === 'SUPERADMIN';
  const authAccountId = auth.get('accountId');
  const activeAccountMap = entities.getIn(['accounts', 'models', authAccountId]);
  const accountsFlagMap = featureFlags.getIn(['flags', 'accounts-available-to-switch']);
  const enterpriseAccountsMap = entities
    .getIn(['accounts', 'models'])
    .filter((account) => account.enterpriseId === auth.get('enterpriseId'));

  return {
    accountsFlagMap,
    enterpriseAccountsMap,
    activeAccountMap,
    isSuperAdmin,
    authAccountId,
    isCollapsed: toolbar.get('isCollapsed'),
    isHovered: toolbar.get('isHovered'),
    isSearchCollapsed: toolbar.get('isSearchCollapsed'),
    user: auth.get('user'),
    enterprise: auth.get('enterprise'),
    isReady: !!auth.get('accountId') && !!activeAccountMap,
  };
};

const mapActionsToProps = (dispatch) =>
  bindActionCreators(
    {
      setIsCollapsed,
      setIsHovered,
      setIsSearchCollapsed,
      logout,
      runOnDemandSync,
      fetchEntities,
      switchActiveAccount,
      push,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapActionsToProps)(TopBarContainer);
