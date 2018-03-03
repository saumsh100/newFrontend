import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col, Card, Loading } from '../../../library';
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
      <div className={styles.patientSub}>
        <div className={styles.content}>
          <div className={styles.dataTable}>
            <div className={styles.patientInfoHeader}> Patient Info </div>
            <Card className={styles.card} >
              {patient ?
                <DataTable
                  patient={patient}
                /> : null}
            </Card>
          </div>
          <div className={styles.timeLineTable}>
            <div className={styles.timeLineHeader}> Timeline & Activities </div>
            <Card className={styles.eventsCard} runAnimation loaded={wasFetched} loaderStyle={styles.loaderStyle}>
              {wasFetched ?
                <EventsTable
                  wasFetched={wasFetched}
                  events={events}
                  patientId={patient.id}
                /> : null}
            </Card>
          </div>
        </div>
      </div>
    );
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
