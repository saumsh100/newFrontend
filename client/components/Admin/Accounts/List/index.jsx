
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { getModel, getCollection } from '../../../Utils';
import { fetchEntities, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import PageContainer from '../../General/PageContainer';
import EditableList from '../../General/EditableList';
import LastSyncDisplay from '../../../LastSyncDisplay';
import { VButton } from '../../../library';
import styles from './styles.scss';

class AccountsList extends Component {
  componentDidMount() {
    this.props.fetchEntities({
      key: 'accounts',
      url: `/api/enterprises/${this.props.enterpriseId}/accounts`,
    });
  }

  render() {
    const { enterprise, accounts, history } = this.props;

    const pageTitle = () => `${enterprise.name}`;

    const breadcrumbs = () => [
      {
        icon: 'home', key: 'home', home: true, link: '/admin',
      },
      { title: 'Enterprises', key: 'enterprises', link: '/admin/enterprises' },
      { title: pageTitle(), key: enterprise.id },
    ];

    const baseUrl = (path = '') => `/admin/enterprises/${enterprise.id}/accounts${path}`;
    const navigateToEdit = ({ id }) => history.push(baseUrl(`/${id}/edit`));
    const deleteAccount = ({ id }) =>
      this.props.deleteEntityRequest({
        key: 'accounts',
        url: `/api/enterprises/${enterprise.id}/accounts/${id}`,
        id,
      });

    const renderAddButton = () => (
      <VButton as={Link} icon="plus" positive rounded compact to={baseUrl('/create')}>
        Add Account
      </VButton>
    );

    const renderAccountDisplay = account => (
      <div className={styles.wrapper}>
        <strong className={styles.list}>{account.name}</strong>
        <LastSyncDisplay className={styles.lastSyncDisplay} date={account.lastSyncDate} />
      </div>
    );

    return (
      <div>
        {enterprise ? (
          <PageContainer
            title={pageTitle()}
            breadcrumbs={breadcrumbs()}
            renderButtons={renderAddButton}
          >
            <EditableList
              items={accounts}
              render={renderAccountDisplay}
              onEdit={navigateToEdit}
              onDelete={deleteAccount}
              confirm={({ name }) => `Do you really want to delete ${name} Account?`}
            />
          </PageContainer>
        ) : (
          'Loading...'
        )}
      </div>
    );
  }
}

AccountsList.propTypes = {
  children: PropTypes.node,
  enterprise: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  fetchEntities: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  enterpriseId: PropTypes.string.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const stateToProps = (state, { match: { params: { enterpriseId } } }) => ({
  enterpriseId,
  enterprise: getModel(state, 'enterprises', enterpriseId),
  accounts: getCollection(
    state,
    'accounts',
    account => account.get('enterpriseId') === enterpriseId,
  ),
});

const dispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchEntities,
      deleteEntityRequest,
    },
    dispatch,
  );

export default connect(stateToProps, dispatchToProps)(AccountsList);
