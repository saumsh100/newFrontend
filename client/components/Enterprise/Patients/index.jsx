import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from 'react-loader';
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Page from '../Page';
import Table from '../Table';
import withAuthProps from '../../../hocs/withAuthProps';
import { getModel } from '../../Utils';
import { fetchEntities } from '../../../thunks/fetchEntities';


const fetchEnterpriseDashboard = (segmentId, rawWhere) => {
  const from = moment().subtract(1, 'month');
  const to = moment();

  const qs = {
    startDate: from.toISOString(),
    endDate: to.toISOString(),
    rawWhere: rawWhere ? JSON.stringify(rawWhere) : undefined,
  };

  return fetchEntities({ key: 'enterpriseDashboard', url: `/api/enterprises/dashboard/patients?${queryString.stringify(qs)}` });
};

class PatientsPage extends Component {
  componentWillMount() {
    this.props.fetchEnterpriseDashboard();
  }

  componentWillReceiveProps(props) {
    if (JSON.stringify(this.props.rawWhere) !== JSON.stringify(props.rawWhere)) {
      this.props.fetchEnterpriseDashboard(null, props.rawWhere);
    }
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
  rawWhere: PropTypes.shape({}).isRequired,
  applied: PropTypes.bool.isRequired,
};

const stateToProps = (state, { isSuperAdmin }) => (isSuperAdmin ? {
  enterpriseDashboardPatients: getModel(state, 'enterpriseDashboard', 'patients'),
  applied: state.segments.applied,
  rawWhere: state.segments.rawWhere,
} : {});

const actionsToProps = dispatch => bindActionCreators({
  fetchEnterpriseDashboard,
}, dispatch);

export default withAuthProps(connect(stateToProps, actionsToProps)(PatientsPage));
