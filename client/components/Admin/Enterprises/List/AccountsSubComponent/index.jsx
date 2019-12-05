
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntitiesRequest } from '../../../../../thunks/fetchEntities';
import { getCollection } from '../../../../Utils';
import { switchActiveEnterprise } from '../../../../../thunks/auth';
import { accountShape } from '../../../../library/PropTypeShapes';
import AccountsTable from './AccountsTable';

class AccountsSubComponent extends Component {
  componentDidMount() {
    this.props.fetchEntitiesRequest({
      key: 'accounts',
      url: `/api/enterprises/${this.props.enterpriseId}/accounts`,
    });
  }

  render() {
    const { accounts } = this.props;

    return accounts && <AccountsTable accounts={accounts} loaded={accounts.size} />;
  }
}

AccountsSubComponent.propTypes = {
  fetchEntitiesRequest: PropTypes.func.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.shape(accountShape)).isRequired,
};

const stateToProps = (state, { enterpriseId }) => ({
  enterpriseId,
  accounts: getCollection(
    state,
    'accounts',
    account => account.get('enterpriseId') === enterpriseId,
  ),
});

const dispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchEntitiesRequest,
      switchActiveEnterprise,
    },
    dispatch,
  );

export default connect(
  stateToProps,
  dispatchToProps,
)(AccountsSubComponent);
