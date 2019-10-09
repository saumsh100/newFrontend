
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../../../library';
import EnabledFeature from '../../../library/EnabledFeature';
import { fetchEntitiesRequest } from '../../../../thunks/fetchEntities';
import { deleteAllEntity } from '../../../../reducers/entities';
import { setIsNoteFormActive } from '../../../../reducers/patientTable';
import Event from '../../../../entities/models/Event';
import { patientShape } from '../../../library/PropTypeShapes';
import DataTable from './DataTable';
import PatientInfoSection from './PatientInfoSection';
import EventsTable from './EventsTable';
import { getEventsOffsetLimitObj } from '../../Shared/helpers';
import PatientActionsDropdown from '../../PatientInfo/ActionsDropdown';
import styles from './styles.scss';

class PatientSubComponent extends Component {
  componentDidMount() {
    const {
      patient: { id },
    } = this.props;
    this.props.fetchEntitiesRequest({
      key: 'patientTimelineEvents',
      id: 'getPatientEvents',
      url: `/api/patients/${id}/events`,
      params: {
        limit: 5,
        eventsOffsetLimitObj: getEventsOffsetLimitObj(),
      },
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
            <div className={styles.patientInfoHeader}>
              <div className={styles.patientInfoHeader_title}>Patient Info</div>
              <EnabledFeature
                predicate={({ flags }) => flags.get('patient-actions-button')}
                render={() => <PatientActionsDropdown patient={patient} align="right" />}
              />
            </div>
            <Card className={styles.card}>
              {patient && (
                <EnabledFeature
                  predicate={({ flags }) => flags.get('patient-info-new-collapsible-view')}
                  render={() => <PatientInfoSection patient={patient} />}
                  fallback={() => <DataTable patient={patient} />}
                />
              )}
            </Card>
          </div>
          <div className={styles.timeLineTable}>
            <div className={styles.timeLineHeader}>Timeline & Activities</div>
            <Card
              className={styles.eventsCard}
              runAnimation
              loaded={wasFetched}
              loaderStyle={styles.loaderStyle}
            >
              {wasFetched && (
                <EventsTable
                  wasFetched={wasFetched}
                  events={events}
                  patientId={patient.id}
                  patient={patient}
                />
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
    .getIn(['patientTimelineEvents', 'models'])
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
      setIsNoteFormActive,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientSubComponent);
