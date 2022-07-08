import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Query } from '@apollo/client/react/components';
import classNames from 'classnames';
import { Map } from 'immutable';
import { StandardButton as Button, Col, Grid, Row, Tab, Tabs, Card } from '../../library';
import PatientModel from '../../../entities/models/Patient';
import AccountModel from '../../../entities/models/Account';
import {
  fetchEntities,
  fetchEntitiesRequest,
  updateEntityRequest,
} from '../../../thunks/fetchEntities';
import { deleteAllEntity } from '../../../reducers/entities';
import {
  addRemoveTimelineFilters,
  clearAllTimelineFilters,
  selectAllTimelineFilters,
} from '../../../reducers/patientTable';
import FilterTimeline from './FilterTimeline';
import Loader from '../../Loader';
import EditDisplay from './EditDisplay';
import TopDisplay from './TopDisplay';
import Timeline from './Timeline';
import LeftInfoDisplay from './LeftInfoDisplay';
import { isResponsive } from '../../../util/hub';
import { getEventsOffsetLimitObj } from '../Shared/helpers';
import patientInfoQuery from './PatientInfo_Query';
import styles from './styles.scss';

const HeaderModalComponent = ({ icon, text, onClick, title, isTimeline }) => (
  <div
    className={classNames(styles.editButtonMobile, {
      [styles.editButton]: isResponsive(),
      [styles.textContainer]: !isResponsive(),
    })}
  >
    <div
      className={classNames(styles.cardTitle, {
        [styles.cardTitle_timeline]: isTimeline,
      })}
    >
      {' '}
      {title}{' '}
    </div>
    <Button
      onClick={onClick}
      variant="secondary"
      iconRight={icon}
      title={text}
      className={styles.headerModalButton}
    />
  </div>
);
HeaderModalComponent.defaultProps = {
  isTimeline: false,
};

HeaderModalComponent.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isTimeline: PropTypes.bool,
};

class PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filterOpen: false,
      tabIndex: 0,
      pageTab: 0,
      defaultEvents: props.filters,
    };

    this.changePageTab = this.changePageTab.bind(this);
    this.openModal = this.openModal.bind(this);
    this.openFilter = this.openFilter.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.addRemoveFilter = this.addRemoveFilter.bind(this);
    this.fetchPatientData = this.fetchPatientData.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
  }

  componentDidMount() {
    const { patientId } = this.props.match.params;
    const url = `/api/patients/${patientId}`;
    this.fetchPatientData(patientId, url);
    if (this.props.patient) {
      this.fetchEvents();
    }
  }

  componentDidUpdate(prevProps) {
    const prevPatientId = prevProps.match.params.patientId;
    const { patientId } = this.props.match.params;
    if (patientId !== prevPatientId) {
      const url = `/api/patients/${patientId}`;
      Promise.all([this.fetchPatientData(patientId, url), this.fetchEvents()]);
    }
  }

  componentWillUnmount() {
    this.props.deleteAllEntity('events');
    this.props.selectAllTimelineFilters();
  }

  handleTabChange(index) {
    this.setState({ tabIndex: index });
  }

  changePageTab(pageTab) {
    this.setState({ pageTab });
  }

  fetchEvents() {
    return this.props.fetchEntitiesRequest({
      key: 'patientTimelineEvents',
      id: 'getPatientEvents',
      url: `/api/patients/${this.props.patient.id}/events`,
      params: {
        limit: 10,
        eventsOffsetLimitObj: getEventsOffsetLimitObj(10),
      },
    });
  }

  fetchPatientData(patientId, url) {
    const { activeAccount } = this.props;

    return Promise.all([
      this.props.fetchEntitiesRequest({
        id: 'fetchPatient',
        key: 'patients',
        url,
      }),
      this.props.fetchEntitiesRequest({
        id: 'patientIdStats',
        url: `/api/patients/${patientId}/stats`,
      }),
      this.props.fetchEntitiesRequest({
        id: 'fetchReminders',
        key: 'reminders',
        url: `/api/accounts/${activeAccount.id}/reminders`,
      }),
      this.props.fetchEntitiesRequest({
        id: 'fetchRecalls',
        key: 'recalls',
        url: `/api/accounts/${activeAccount.id}/recalls`,
      }),
    ]);
  }

  openModal() {
    this.setState({
      isOpen: true,
    });
  }

  openFilter() {
    this.setState({ filterOpen: true });
  }

  reinitializeState() {
    this.setState({
      isOpen: false,
      filterOpen: false,
    });
  }

  addRemoveFilter(filter) {
    this.props.addRemoveTimelineFilters({ type: filter });
  }

  render() {
    const { patientId } = this.props.match.params;
    const {
      patient,
      patientStats,
      wasStatsFetched,
      activeAccount,
      role,
      wasPatientFetched,
      accountViewer,
      reminders,
      recalls,
      setRefetchState,
    } = this.props;

    const wasAllFetched = wasPatientFetched;
    const shouldDisplayInfoPage = !isResponsive() || this.state.pageTab === 0;
    const shouldDisplayTimelinePage = !isResponsive() || this.state.pageTab === 1;
    return (
      <Grid className={styles.mainContainer}>
        <Row>
          <Col sm={12} md={12} className={styles.topDisplay}>
            <TopDisplay
              patient={patient}
              patientStats={patientStats}
              wasStatsFetched={wasStatsFetched}
              wasPatientFetched={wasPatientFetched}
              activeAccount={activeAccount}
            />
            {isResponsive() && (
              <HeaderModalComponent
                icon="edit"
                text="Edit"
                onClick={() => this.openModal()}
                title="Patient Info"
              />
            )}
            <EditDisplay
              accountViewer={accountViewer}
              patient={patient}
              updateEntityRequest={this.props.updateEntityRequest}
              reinitializeState={this.reinitializeState}
              isOpen={this.state.isOpen}
              outerTabIndex={this.state.tabIndex}
              role={role}
              reminders={reminders}
              recalls={recalls}
              wasAllFetched={wasAllFetched}
              setRefetchState={setRefetchState}
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={12} className={styles.body}>
            <div className={styles.tabsSection}>
              <Tabs fluid index={this.state.pageTab} onChange={this.changePageTab}>
                <Tab
                  label="Patient Info"
                  inactiveClass={styles.inactiveTab}
                  activeClass={styles.activeTab}
                />
                <Tab
                  label="Timeline"
                  inactiveClass={styles.inactiveTab}
                  activeClass={styles.activeTab}
                />
              </Tabs>
            </div>
            {shouldDisplayInfoPage && (
              <div className={styles.infoDisplay}>
                <Card className={styles.sideCard}>
                  {!isResponsive() && (
                    <HeaderModalComponent
                      icon="edit"
                      text="Edit"
                      onClick={() => this.openModal()}
                      title="Patient Info"
                    />
                  )}
                  <LeftInfoDisplay
                    accountViewer={accountViewer}
                    patient={patient}
                    openModal={this.openModal}
                    reinitializeState={this.reinitializeState}
                    tabIndex={this.state.tabIndex}
                    handleTabChange={this.handleTabChange}
                    activeAccount={activeAccount}
                    isPatientInfo
                  />
                </Card>
              </div>
            )}
            {shouldDisplayTimelinePage && (
              <Card className={styles.timeline}>
                {!isResponsive() && (
                  <Popover
                    isOpen={this.state.filterOpen}
                    body={[
                      <FilterTimeline
                        addRemoveFilter={this.addRemoveFilter}
                        defaultEvents={this.state.defaultEvents}
                        filters={this.props.filters}
                        clearFilters={this.props.clearAllTimelineFilters}
                        selectAllFilters={this.props.selectAllTimelineFilters}
                      />,
                    ]}
                    preferPlace="below"
                    tipSize={0.01}
                    onOuterAction={this.reinitializeState}
                  >
                    <HeaderModalComponent
                      icon="filter"
                      text="Filter"
                      onClick={this.openFilter}
                      title="Timeline & Activities"
                      isTimeline
                    />
                  </Popover>
                )}
                <Timeline
                  patient={patient}
                  patientId={patientId}
                  filters={this.props.filters}
                  wasPatientFetched={wasPatientFetched}
                />
              </Card>
            )}
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      fetchEntitiesRequest,
      updateEntityRequest,
      addRemoveTimelineFilters,
      selectAllTimelineFilters,
      clearAllTimelineFilters,
      deleteAllEntity,
    },
    dispatch,
  );
}

function mapStateToProps({ entities, apiRequests, patientTable, auth }, { match }) {
  const patientStats = apiRequests.getIn(['patientIdStats', 'data']) || null;
  const wasStatsFetched = apiRequests.getIn(['patientIdStats', 'wasFetched']) || false;
  const wasPatientFetched = apiRequests.getIn(['fetchPatient', 'wasFetched']) || false;
  const wasRemindersFetched = apiRequests.getIn(['fetchReminders', 'wasFetched']) || false;
  const wasRecallsFetched = apiRequests.getIn(['fetchRecalls', 'wasFetched']) || false;
  const accountId = auth.get('accountId');
  const activeAccount = entities.getIn(['accounts', 'models', accountId]);

  return {
    patient: entities.getIn(['patients', 'models', match.params.patientId]),
    patientStats,
    wasStatsFetched,
    filters: patientTable.get('timelineFilters'),
    activeAccount,
    role: auth.get('role'),
    wasPatientFetched,
    reminders: entities.getIn(['reminders', 'models']),
    recalls: entities.getIn(['recalls', 'models']),
    wasRemindersFetched,
    wasRecallsFetched,
  };
}

PatientInfo.propTypes = {
  wasPatientFetched: PropTypes.bool,
  wasStatsFetched: PropTypes.bool,
  role: PropTypes.string,
  accountViewer: PropTypes.shape({
    id: PropTypes.string,
    patient: PropTypes.shape({
      ccId: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
  patientStats: PropTypes.instanceOf(Map),
  patient: PropTypes.instanceOf(PatientModel),
  activeAccount: PropTypes.instanceOf(AccountModel).isRequired,
  filters: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  recalls: PropTypes.instanceOf(Map).isRequired,
  reminders: PropTypes.instanceOf(Map).isRequired,
  selectAllTimelineFilters: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  addRemoveTimelineFilters: PropTypes.func.isRequired,
  clearAllTimelineFilters: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  deleteAllEntity: PropTypes.func.isRequired,
  setRefetchState: PropTypes.func.isRequired,
};

PatientInfo.defaultProps = {
  accountViewer: null,
  patient: null,
  patientStats: null,
  role: '',
  wasPatientFetched: false,
  wasStatsFetched: false,
};

const PatientInfoRenderer =
  (parentProps) =>
  // eslint-disable-next-line react/prop-types
  ({ error, loading, data }) => {
    if (loading) return <Loader />;

    if (error) {
      return <div>Error!</div>;
    }
    return <PatientInfo {...parentProps} {...data} />;
  };

const PatientInfoWithData = (props) => {
  const [refetchState, setRefetchState] = useState(false);

  useEffect(() => {
    setRefetchState(false);
  }, [refetchState]);

  if (!props.patient) {
    return <PatientInfo {...props} />;
  }
  return (
    <Query
      query={patientInfoQuery}
      fetchPolicy="cache-and-network"
      variables={{ patientId: props.patient.id }}
      pollInterval={refetchState && 1000}
    >
      {PatientInfoRenderer({ setRefetchState, ...props })}
    </Query>
  );
};

PatientInfoWithData.propTypes = {
  patient: PropTypes.shape({
    ccId: PropTypes.string,
    id: PropTypes.string,
  }),
};

PatientInfoWithData.defaultProps = {
  patient: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientInfoWithData);
