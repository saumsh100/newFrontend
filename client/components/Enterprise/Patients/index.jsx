import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from 'react-loader';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from '../Page';
import Table from '../Table';
import withAuthProps from '../../../hocs/withAuthProps';
import { getModel } from '../../Utils';
import { fetchEntities } from '../../../thunks/fetchEntities';

const fetchEnterpriseDashboard = () => fetchEntities({ key: 'enterpriseDashboard', url: '/api/enterprises/dashboard/patients' });

class PatientsPage extends Component {
  componentWillMount() {
    this.props.fetchEnterpriseDashboard();
  }

  render() {
    return (
      !this.props.enterpriseDashboardPatients ?
        <Loading /> : <Page>
          <Table
            clinics={this.props.enterpriseDashboardPatients.clinics}
            totals={this.props.enterpriseDashboardPatients.totals}
          />
        </Page>
    );
  }
}

PatientsPage.propTypes = {
  fetchEnterpriseDashboard: PropTypes.func.isRequired,
  enterprises: PropTypes.arrayOf(PropTypes.object),
  enterpriseDashboardPatients: PropTypes.shape({
    isFetching: PropTypes.bool,
    clinics: PropTypes.shape({}),
    totals: PropTypes.shape({}),
  }),
  enterpriseId: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

const stateToProps = (state, { isSuperAdmin }) => (isSuperAdmin ? {
  enterpriseDashboardPatients: getModel(state, 'enterpriseDashboard', 'patients'),
} : {});

const actionsToProps = dispatch => bindActionCreators({
  fetchEnterpriseDashboard,
}, dispatch);

export default withAuthProps(connect(stateToProps, actionsToProps)(PatientsPage));
