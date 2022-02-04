import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card } from '../../../library';
import { fetchEntitiesRequest } from '../../../../thunks/fetchEntities';
import { deleteAllEntity } from '../../../../reducers/entities';
import { setIsNoteFormActive } from '../../../../reducers/patientTable';
import Event from '../../../../entities/models/Event';
import { patientShape, accountShape } from '../../../library/PropTypeShapes';
import EventsTable from './EventsTable';
import { getEventsOffsetLimitObj } from '../../Shared/helpers';
import PatientActionsDropdown from '../../PatientInfo/ActionsDropdown';
import patientInfoQuery from '../../PatientInfo/PatientInfo_Query';
import LeftInfoDisplay from '../../PatientInfo/LeftInfoDisplay';
import Icon from '../../../library/Icon';
import Button from '../../../library/Button';
import styles from './styles.scss';
import ui from '../../../../styles/ui-kit.scss';

class PatientSubComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

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

  handleTabChange(index) {
    this.setState({ tabIndex: index });
  }

  render() {
    const { patient, events, wasFetched, accountViewer, activeAccount } = this.props;
    return (
      <div className={styles.patientSub}>
        <div className={styles.content}>
          <div className={styles.dataTable}>
            <div className={styles.patientInfoHeader}>
              <div className={styles.patientInfoHeader_title}>Patient Info</div>
              <PatientActionsDropdown
                patient={patient}
                align="right"
                render={(props) => (
                  <Button
                    className={`${styles.actionsButtonNormal} ${styles.actionsButton} ${ui.modal__save} `}
                    {...props}
                  >
                    <div className={styles.actionText}>Actions</div>
                    <Icon className={styles.actionIcon} icon="caret-down" type="solid" />
                  </Button>
                )}
              />
            </div>
            <LeftInfoDisplay
              accountViewer={accountViewer}
              patient={patient}
              containerClass={styles.containerClass}
              tabIndex={this.state.tabIndex}
              handleTabChange={this.handleTabChange}
              activeAccount={activeAccount}
            />
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

function mapStateToProps({ entities, apiRequests, auth }, { patient }) {
  const waitForAuth = auth.get('accountId');
  const activeAccount = entities.getIn(['accounts', 'models', waitForAuth]);
  const wasFetched = apiRequests.get('getPatientEvents')
    ? apiRequests.get('getPatientEvents').wasFetched
    : null;

  const events = entities
    .getIn(['patientTimelineEvents', 'models'])
    .toArray()
    .filter((event) => event.get('patientId') === patient.id);

  return {
    activeAccount,
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
  accountViewer: PropTypes.shape({
    id: PropTypes.string,
    patient: patientShape,
  }).isRequired,
  activeAccount: PropTypes.shape(accountShape).isRequired,
};

PatientSubComponent.defaultProps = {
  events: [],
  wasFetched: false,
};

const PatientSubComponentWithData = (parentProps) => {
  const [refetchedState, setRefetchedState] = useState(true);
  useEffect(() => {
    setRefetchedState(false);
  }, []);
  return (
    <Query
      query={patientInfoQuery}
      variables={{ patientId: parentProps.patient.id }}
      fetchPolicy="cache-and-network"
      pollInterval={refetchedState && 500}
    >
      {({ error, loading, data }) => {
        if (loading) return null;

        if (error) {
          return <div>Error!</div>;
        }
        const combinedProps = { setRefetchedState, ...parentProps };

        return <PatientSubComponent {...combinedProps} {...data} />;
      }}
    </Query>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientSubComponentWithData);
