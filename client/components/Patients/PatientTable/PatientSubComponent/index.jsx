
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../../../library';
import { fetchEntitiesRequest } from '../../../../thunks/fetchEntities';
import { deleteAllEntity } from '../../../../actions/entities';
import Event from '../../../../entities/models/Event';
import { patientShape } from '../../../library/PropTypeShapes';
import DataTable from './DataTable';
import EventsTable from './EventsTable';
import styles from './styles.scss';

class PatientSubComponent extends Component {
  componentDidMount() {
    const { patient } = this.props;

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

  componentWillUnmount() {
    this.props.deleteAllEntity('events');
  }

  render() {
    const { patient, events, wasFetched } = this.props;

    return (
      <div className={styles.patientSub}>
        <div className={styles.content}>
          <div className={styles.dataTable}>
            <div className={styles.patientInfoHeader}> Patient Info </div>
            <Card className={styles.card}>{patient && <DataTable patient={patient} />}</Card>
          </div>
          <div className={styles.timeLineTable}>
            <div className={styles.timeLineHeader}> Timeline & Activities </div>
            <Card
              className={styles.eventsCard}
              runAnimation
              loaded={wasFetched}
              loaderStyle={styles.loaderStyle}
            >
              {wasFetched && (
                <EventsTable wasFetched={wasFetched} events={events} patientId={patient.id} />
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ entities, apiRequests }, { patient }) {
  const wasFetched = apiRequests.get('getPatientEvents')
    ? apiRequests.get('getPatientEvents').wasFetched
    : null;

  const events = entities
    .getIn(['events', 'models'])
    .toArray()
    .filter(event => event.get('patientId') === patient.id);

  return {
    events,
    wasFetched,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntitiesRequest,
      deleteAllEntity,
    },
    dispatch,
  );
}

PatientSubComponent.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event)),
  wasFetched: PropTypes.bool,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  deleteAllEntity: PropTypes.func.isRequired,
};

PatientSubComponent.defaultProps = {
  events: [],
  wasFetched: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientSubComponent);
