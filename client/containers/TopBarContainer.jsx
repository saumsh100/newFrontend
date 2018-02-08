
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
import { getCollection, getModel } from '../components/Utils';

const fetchAccounts =
  () => fetchEntities({ key: 'accounts', url: '/api/accounts' });

class TopBarContainer extends Component {
  componentWillMount() {
    this.props.fetchAccounts();
  }

  render() {
    return <TopBar {...this.props} />;
  }
}

TopBarContainer.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  isSearchCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  setIsSearchCollapsed: PropTypes.func.isRequired,
  fetchAccounts: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object),
};

const mapStateToProps = state => ({
  isCollapsed: state.toolbar.get('isCollapsed'),
  isSearchCollapsed: state.toolbar.get('isSearchCollapsed'),
  accounts: getCollection(state, 'accounts', account => (account.enterpriseId === state.auth.get('enterpriseId'))),
  activeAccount: getModel(state, 'accounts', state.auth.get('accountId')),
  user: state.auth.get('user'),
  enterprise: state.auth.get('enterprise'),
});

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    setIsCollapsed,
    setIsSearchCollapsed,
    logout,
    runOnDemandSync,
    fetchAccounts,
    switchActiveAccount,
    push,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(TopBarContainer);
