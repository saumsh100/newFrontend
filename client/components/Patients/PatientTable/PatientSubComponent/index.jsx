import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col } from '../../../library';
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
            <div className={styles.patientInfoHeader}> PATIENT INFO </div>
            <DataTable
              patient={patient}
            />
          </Col>
          <Col xs={12} sm={12} md={8} >
            <div className={styles.timeLineHeader}> TIMELINE & ACTIVITIES </div>
            <div className={styles.eventsTable}>
              <div className={styles.verticalLine}>&nbsp;</div>
              <EventsTable
                wasFetched={wasFetched}
                events={events}
                patientId={patient.id}
              />
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

PatientSubComponent.propTypes = {
  patient: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  wasFetched: PropTypes.bool.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
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
