
import React, { Component } from 'react';
import PageContainer from '../General/PageContainer';
import withEntitiesRequest from '../../../hocs/withEntities';
import ConnectorsList from './ConnectorsList';

const breadcrumbs = [
  {
    icon: 'home', key: 'home', home: true, link: '/admin/nasa',
  },
  { title: 'Connectors', key: 'connectors', link: '/admin/nasa' },
];

class Connectors extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PageContainer title="NASA" breadcrumbs={breadcrumbs}>
        {this.props.isFetching ? (
          <div>Fetching...</div>
        ) : (
          <ConnectorsList accounts={this.props.accounts} />
        )}
      </PageContainer>
    );
  }
}

export default withEntitiesRequest({ key: 'accounts', base: true })(Connectors);
