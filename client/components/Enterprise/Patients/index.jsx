import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from '../Page';
import Table from '../Table';
import withAuthProps from '../../../hocs/withAuthProps';
import { getCollection } from '../../Utils';
import { fetchEntities } from '../../../thunks/fetchEntities';
import { switchActiveEnterprise } from '../../../thunks/auth';

const fetchEnterprises = () => fetchEntities({ key: 'enterprises' });

class PatientsPage extends Component {
  componentWillMount() {
    this.props.fetchEnterprises();
  }

  selectEnterprise(enterpriseId) {
    this.props.switchActiveEnterprise(enterpriseId, this.props.location.pathname);
  }

  render() {
    const { enterprises, enterpriseId } = this.props;

    return (
      <Page>
        {enterprises ? (
          <select onChange={e => this.selectEnterprise(e.target.value)} value={enterpriseId}>
            { enterprises.map(enterprise =>
              <option value={enterprise.id}>{enterprise.name}</option>
            ) }
          </select>
        ) : null}
        <Table />
      </Page>
    );
  }
}

PatientsPage.propTypes = {
  fetchEnterprises: PropTypes.func.isRequired,
  switchActiveEnterprise: PropTypes.func.isRequired,
  enterprises: PropTypes.arrayOf(PropTypes.object),
  enterpriseId: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  })
};

const stateToProps = (state, { isSuperAdmin }) => (isSuperAdmin ? {
  enterprises: getCollection(state, 'enterprises'),
} : {});

const actionsToProps = dispatch => bindActionCreators({
  fetchEnterprises,
  switchActiveEnterprise,
}, dispatch);

export default withAuthProps(connect(stateToProps, actionsToProps)(PatientsPage));
