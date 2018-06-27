
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Loader from '../../Loader';
import Page from '../Page';
import Table from '../Table';
import Graph from '../Graph';
import { Grid, Row, Col } from '../../library/';
import withAuthProps from '../../../hocs/withAuthProps';
import { getModel } from '../../Utils';
import { fetchEntities } from '../../../thunks/fetchEntities';

import styles from './styles.scss';

const fetchEnterpriseDashboard = (segmentId, rawWhere) => {
  const from = moment().subtract(1, 'month');
  const to = moment();

  const qs = {
    startDate: from.toISOString(),
    endDate: to.toISOString(),
    rawWhere: rawWhere ? JSON.stringify(rawWhere) : undefined,
  };

  return fetchEntities({
    key: 'enterpriseDashboard',
    url: `/api/enterprises/dashboard/patients?${queryString.stringify(qs)}`,
  });
};

class PatientsPage extends Component {
  componentWillMount() {
    this.props.fetchEnterpriseDashboard();
  }

  componentWillReceiveProps(props) {
    if (
      JSON.stringify(this.props.rawWhere) !== JSON.stringify(props.rawWhere)
    ) {
      this.props.fetchEnterpriseDashboard(null, props.rawWhere);
    }
  }

  render() {
    const isLoaded = this.props.enterpriseDashboardPatients;
    if (!isLoaded) {
      return <Loader inContainer />;
    }

    return (
      <Page>
        <Grid className={styles.container}>
          <Row>
            <Col md={9}>
              <Graph
                clinics={this.props.enterpriseDashboardPatients.clinics}
                totals={this.props.enterpriseDashboardPatients.totals}
              />
            </Col>
          </Row>
        </Grid>
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

const stateToProps = (state, { isSuperAdmin }) =>
  (isSuperAdmin
    ? {
      enterpriseDashboardPatients: getModel(
        state,
        'enterpriseDashboard',
        'patients',
      ),
      applied: state.segments.applied,
      rawWhere: state.segments.rawWhere,
    }
    : {});

const actionsToProps = dispatch =>
  bindActionCreators(
    {
      fetchEnterpriseDashboard,
    },
    dispatch,
  );

export default withAuthProps(connect(
  stateToProps,
  actionsToProps,
)(PatientsPage));
