
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { fetchEntities, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import { VButton } from '../../../library/index';
import PageContainer from '../../General/PageContainer';
import EditableList from '../../General/EditableList';
import { getCollection } from '../../../Utils';
import withAuthProps from '../../../../hocs/withAuthProps';
import { switchActiveEnterprise } from '../../../../thunks/auth';
import styles from './styles.scss';

class EnterpriseList extends Component {
  componentWillMount() {
    this.props.fetchEntities({ key: 'enterprises' });
  }

  selectEnterprise(enterpriseId) {
    this.props.switchActiveEnterprise(enterpriseId, this.props.location.pathname);
  }

  render() {
    const { enterprises, enterpriseId } = this.props;

    const baseUrl = (path = '') => `/admin/enterprises${path}`;

    const deleteRequest = ({ id }) => this.props.deleteEntityRequest({ key: 'enterprises', id });
    const navigateToEditPage = ({ id }) => this.props.navigate(baseUrl(`/${id}/edit`));

    const breadcrumbs = [
      { icon: 'home', key: 'home', home: true, link: '/admin' },
      { title: 'Enterprises', key: 'enterprises', link: '/admin/enterprises' },
    ];

    const renderAddButton = () =>
      <VButton
        as={Link}
        icon="plus"
        positive
        rounded
        compact
        to={baseUrl('/create')}
      >Add Enterprise</VButton>;

    const renderListItem = ({ id, name }) =>
      <strong><Link to={baseUrl(`/${id}/accounts`)} className={styles.link}>{name}</Link></strong>;

    return (
      <PageContainer title="Enterprises" breadcrumbs={breadcrumbs} renderButtons={renderAddButton}>
        <EditableList
          items={enterprises}
          render={renderListItem}
          confirm={item => `Do you really want to delete "${item.name}" Enterprise?`}
          onDelete={deleteRequest}
          onEdit={navigateToEditPage}
        />
        <br /><br />
        <br /><br />
        <span>Switch Enterprise</span>
        {enterprises ? (
          <select onChange={e => this.selectEnterprise(e.target.value)} value={enterpriseId}>
            { enterprises.map(enterprise =>
              <option key={enterprise.id} value={enterprise.id}>{enterprise.name}</option>
              ) }
          </select>
          ) : null}
      </PageContainer>
    );
  }
}

EnterpriseList.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  enterprises: PropTypes.arrayOf(
    PropTypes.object
  ),
};

const stateToProps = state => ({
  enterprises: getCollection(state, 'enterprises'),
});

const dispatchToProps = dispatch =>
  bindActionCreators({
    fetchEntities,
    deleteEntityRequest,
    switchActiveEnterprise,
    navigate: push,
  }, dispatch);

export default withAuthProps(connect(stateToProps, dispatchToProps)(EnterpriseList));

