
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import classNames from 'classnames';
import { Map } from 'immutable';
import { convertIntervalToMs } from '@carecru/isomorphic';
import { Button, Col, Grid, Icon, Row, Tab, Tabs } from '../../library';
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
import { setBackHandler, setTitle } from '../../../reducers/electron';
import FilterTimeline from './FilterTimeline';
import Loader from '../../Loader';
import EditDisplay from './EditDisplay';
import TopDisplay from './TopDisplay';
import Timeline from './Timeline';
import LeftInfoDisplay from './LeftInfoDisplay';
import { isHub, isResponsive } from '../../../util/hub';
import { getEventsOffsetLimitObj } from '../Shared/helpers';
import patientInfoQuery from './PatientInfo_Query';
import styles from './styles.scss';

const HeaderModalComponent = ({ icon, text, onClick, title }) => (
  <div
    className={classNames({
      [styles.editButton]: isResponsive(),
      [styles.textContainer]: !isResponsive(),
      [styles.editButtonMobile]: !isHub(),
    })}
  >
    <div className={styles.cardTitle}> {title} </div>
    <Button className={classNames(styles.textHeader, styles.textHeaderButton)} onClick={onClick}>
      <div className={styles.textHeader_icon}>
        <Icon icon={icon} />
      </div>
      <div className={styles.textHeader_text}>{text}</div>
    </Button>
  </div>
);

HeaderModalComponent.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

class PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filterOpen: false,
      tabIndex: 0,
      pageTab: 0,
      persistedElectronData: {
        backHandler: null,
        title: null,
      },
      defaultEvents: [],
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

    if (this.props.patient && this.props.filters) {
      this.setState({ defaultEvents: this.props.filters }, () => this.fetchEvents());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { patientId } = this.props.match.params;
    if (patientId !== nextProps.match.params.patientId) {
      const url = `/api/patients/${nextProps.match.params.patientId}`;

      this.fetchPatientData(nextProps.match.params.patientId, url);
      this.fetchEvents();
    }
  }

  componentWillUnmount() {
    this.props.deleteAllEntity('events');
    this.props.selectAllTimelineFilters();
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
        id: 'accountsPatientInfo',
        key: 'accounts',
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
    this.setState(
      {
        isOpen: true,
        persistedElectronData: {
          backHandler: this.props.currentBackHandler,
          title: this.props.currentTitle,
        },
      },
      () => {
        if (!isHub()) {
          return;
        }

        this.props.setTitle('Edit patient info');
        this.props.setBackHandler(this.reinitializeState);
      },
    );
  }

  openFilter() {
    this.setState({ filterOpen: true });
  }

  reinitializeState() {
    this.setState(
      {
        isOpen: false,
        filterOpen: false,
      },
      () => {
        if (isHub()) {
          const { title, backHandler } = this.state.persistedElectronData;
          this.props.setTitle(title);
          this.props.setBackHandler(backHandler);
        }
      },
    );
  }

  handleTabChange(index) {
    this.setState({ tabIndex: index });
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
      accountsFetched,
      activeAccount,
      role,
      wasPatientFetched,
      accountViewer,
      reminders,
      recalls,
    } = this.props;

    const wasAllFetched = accountsFetched && wasPatientFetched;

    const shouldDisplayInfoPage = !isResponsive() || this.state.pageTab === 0;
    const shouldDisplayTimelinePage = !isResponsive() || this.state.pageTab === 1;
    return (
      <Grid className={classNames(styles.mainContainer, { [styles.responsiveContainer]: isHub() })}>
        <Row>
          <Col sm={12} md={12} className={styles.topDisplay}>
            <TopDisplay
              patient={patient}
              patientStats={patientStats}
              wasStatsFetched={wasStatsFetched}
              accountsFetched={accountsFetched}
              wasPatientFetched={wasPatientFetched}
              activeAccount={activeAccount}
            />
            {isResponsive() && (
              <HeaderModalComponent
                icon="pencil"
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
            />
          </Col>
        </Row>
        {(!isHub() || (isHub() && !this.state.isOpen)) && (
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
                  {!isResponsive() && (
                    <HeaderModalComponent
                      icon="pencil"
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
                  />
                </div>
              )}
              {shouldDisplayTimelinePage && (
                <div className={styles.timeline}>
                  {!isResponsive() && (
                    <div className={styles.textContainer}>
                      <div className={styles.cardTitle}>Timeline & Activities</div>
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
                        <Button
                          className={classNames(styles.textHeader, styles.textHeaderButton)}
                          onClick={this.openFilter}
                        >
                          <div className={styles.textHeader_icon}>
                            <Icon icon="filter" />
                          </div>
                          <div className={styles.textHeader_text}>Filter</div>
                        </Button>
                      </Popover>
                    </div>
                  )}
                  <Timeline
                    patient={patient}
                    patientId={patientId}
                    filters={this.props.filters}
                    wasPatientFetched={wasPatientFetched}
                  />
                </div>
              )}
            </Col>
          </Row>
        )}
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
      setTitle,
      setBackHandler,
      deleteAllEntity,
    },
    dispatch,
  );
}

function mapStateToProps({ entities, apiRequests, patientTable, auth, electron }, { match }) {
  const patients = entities.getIn(['patients', 'models']);
  const reminders = entities
    .getIn(['reminders', 'models'])
    .filter(v => v.isActive)
    .sortBy(r => -convertIntervalToMs(r.interval));
  const recalls = entities
    .getIn(['recalls', 'models'])
    .filter(v => v.isActive)
    .sortBy(r => -convertIntervalToMs(r.interval));
  const patientStats = apiRequests.get('patientIdStats')
    ? apiRequests.get('patientIdStats').data
    : null;
  const wasStatsFetched = apiRequests.get('patientIdStats')
    ? apiRequests.get('patientIdStats').wasFetched
    : null;
  const wasPatientFetched = apiRequests.get('fetchPatient')
    ? apiRequests.get('fetchPatient').wasFetched
    : null;
  const wasRemindersFetched = apiRequests.get('fetchReminders')
    ? apiRequests.get('fetchReminders').wasFetched
    : null;
  const wasRecallsFetched = apiRequests.get('fetchRecalls')
    ? apiRequests.get('fetchRecalls').wasFetched
    : null;

  const waitForAuth = auth.get('accountId');
  const role = auth.get('role');
  const activeAccount = entities.getIn(['accounts', 'models', waitForAuth]);

  const accountsFetched = apiRequests.get('accountsPatientInfo')
    ? apiRequests.get('accountsPatientInfo').wasFetched
    : null;

  return {
    patient: patients.get(match.params.patientId),
    patientStats,
    wasStatsFetched,
    filters: patientTable.get('timelineFilters').toJS(),
    activeAccount,
    accountsFetched,
    role,
    wasPatientFetched,
    reminders,
    recalls,
    wasRemindersFetched,
    wasRecallsFetched,
    currentBackHandler: electron.get('backHandler'),
    currentTitle: electron.get('title'),
  };
}

PatientInfo.propTypes = {
  accountsFetched: PropTypes.bool,
  wasPatientFetched: PropTypes.bool,
  wasStatsFetched: PropTypes.bool,
  currentTitle: PropTypes.string,
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
  currentBackHandler: PropTypes.func,
  selectAllTimelineFilters: PropTypes.func.isRequired,
  setBackHandler: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
  addRemoveTimelineFilters: PropTypes.func.isRequired,
  clearAllTimelineFilters: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  deleteAllEntity: PropTypes.func.isRequired,
};

PatientInfo.defaultProps = {
  accountsFetched: false,
  accountViewer: null,
  currentBackHandler: e => e,
  currentTitle: '',
  patient: null,
  patientStats: null,
  role: '',
  wasPatientFetched: false,
  wasStatsFetched: false,
};

// eslint-disable-next-line react/prop-types
const PatientInfoRenderer = parentProps => ({ error, loading, data }) => {
  if (loading) return <Loader />;

  if (error) {
    return <div>Error!</div>;
  }
  return <PatientInfo {...parentProps} {...data} />;
};

const PatientInfoWithData = (parentProps) => {
  if (!parentProps.patient || parentProps.patient === null) {
    return <PatientInfo {...parentProps} />;
  }
  return (
    <Query query={patientInfoQuery} variables={{ patientId: parentProps.patient.id }}>
      {PatientInfoRenderer(parentProps)}
    </Query>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PatientInfoWithData);
