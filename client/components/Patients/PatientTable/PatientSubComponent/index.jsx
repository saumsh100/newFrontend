import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Loader from 'react-loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Event, Grid, Row, Col } from '../../../library';
import { fetchEntitiesRequest } from '../../../../thunks/fetchEntities';
import DataTable from './DataTable';
import EventsTable from './EventsTable';
import styles from './styles.scss';

class PatientSubComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      patient
    } = this.props;

    const query = {
      limit: 5,
    };

    this.props.fetchEntitiesRequest({
      key: 'events',
      id: 'getPatientEvents',
      url: `/api/patients/${patient.id}/events`,
      params: query,
    });
  }

  render() {
    const {
      patient,
      events,
      wasFetched,
    } = this.props;

    return (
      <Grid className={styles.patientSub}>
        <Row className={styles.content}>
          <Col xs={12} sm={12} md={4} className={styles.dataTable}>
            <DataTable
              patient={patient}
            />
          </Col>
          <Col xs={12} sm={12} md={8} className={styles.eventsTable}>
            <div className={styles.verticalLine}>&nbsp;</div>
            <EventsTable
              wasFetched={wasFetched}
              events={events}
              patientId={patient.id}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}


function mapStateToProps({ entities, apiRequests }, { patient }) {
  const wasFetched = (apiRequests.get('getPatientEvents') ? apiRequests.get('getPatientEvents').wasFetched : null);

  const events = entities.getIn(['events', 'models']).toArray().filter((event) => {
    return event.get('patientId') === patient.id;
  });

  return {
    events,
    wasFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientSubComponent);
