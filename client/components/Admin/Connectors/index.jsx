import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from '../General/PageContainer';
import withEntitiesRequest from '../../../hocs/withEntities';
import ConnectorsList from './ConnectorsList';

const breadcrumbs = [
  {
    icon: 'home',
    key: 'home',
    home: true,
    link: '/admin/integrations',
  },
  { title: 'Connectors', key: 'connectors', link: '/admin/integrations' },
];

const Connectors = (props) => (
  <PageContainer title="Integrations" breadcrumbs={breadcrumbs}>
    {props.isFetching ? <div>Fetching...</div> : <ConnectorsList accounts={props.accounts} />}
  </PageContainer>
);

Connectors.propTypes = {
  isFetching: PropTypes.bool,
  accounts: PropTypes.arrayOf(),
};

Connectors.defaultProps = {
  isFetching: false,
  accounts: [],
};

export default withEntitiesRequest({ key: 'accounts', base: true })(Connectors);
