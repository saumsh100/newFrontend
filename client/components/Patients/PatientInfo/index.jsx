
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Grid, Row, Col, Icon} from '../../library';
import {
  fetchEntities,
  fetchEntitiesRequest,
  updateEntityRequest
} from '../../../thunks/fetchEntities';
import {
  addRemoveTimelineFilters,
  selectAllTimelineFilters,
  clearAllTimelineFilters,
} from '../../../reducers/patientTable';
import FilterTimeline from './FilterTimeline';
import EditDisplay from './EditDisplay';
import TopDisplay from './TopDisplay';
import Timeline from './Timeline';
import LeftInfoDisplay from './LeftInfoDisplay';
import styles from './styles.scss';

const HeaderModalComponent = ({ icon, text, onClick, title }) => (
  <div className={styles.textContainer}>
    <div className={styles.cardTitle}> {title} </div>
    <div className={styles.textHeader} onClick={onClick}>
      <div className={styles.textHeader_icon}>
        <Icon icon={icon} />
      </div>
      <div className={styles.textHeader_text}>{text}</div>
    </div>
  </div>
);

// The default list of events shown on the time-line. Add to this when a new event typed is added.
const defaultEvents = ['appointment', 'reminder', 'review', 'call', 'new patient'];

class PatientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filterOpen: false,
      tabIndex: 0,
    };

    this.openModal = this.openModal.bind(this);
    this.openFilter = this.openFilter.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this);
    this.addRemoveFilter = this.addRemoveFilter.bind(this);
  }

  componentWillMount() {
    const patientId = this.props.match.params.patientId;
    const url = `/api/patients/${patientId}`;

    Promise.all([
      this.props.fetchEntities({
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
    ]);
  }

  componentWillUnmount() {
    this.props.selectAllTimelineFilters();
  }

  openModal() {
    this.setState({
      isOpen: true,
    });
  }

  openFilter() {
    this.setState({
      filterOpen: true,
    })
  }

  reinitializeState() {
    this.setState({
      isOpen: false,
      filterOpen: false,
    });
  }

  handleTabChange(index) {
    this.setState({
      tabIndex: index,
    });
  }

  addRemoveFilter(filter) {
    this.props.addRemoveTimelineFilters({ type: filter });
  }

  render() {
    const patientId = this.props.match.params.patientId;

    const {
      patient,
      patientStats,
      updateEntityRequest,
      wasFetched,
      accountsFetched,
      activeAccount,
    } = this.props;


    return (
      <Grid className={styles.mainContainer}>
        <Row>
          <Col sm={12} md={12} className={styles.topDisplay}>
            <TopDisplay
              patient={patient}
              patientStats={patientStats}
              wasFetched={wasFetched}
              accountsFetched={accountsFetched}
              activeAccount={activeAccount}
            />
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col xs={12} className={styles.body}>
            <div className={styles.infoDisplay}>
              <EditDisplay
                patient={patient}
                updateEntityRequest={updateEntityRequest}
                reinitializeState={this.reinitializeState}
                isOpen={this.state.isOpen}
                outerTabIndex={this.state.tabIndex}
              />
              <HeaderModalComponent
                icon="pencil"
                text="Edit"
                onClick={() => this.openModal()}
                title="Patient Info"
              />
              <LeftInfoDisplay
                patient={patient}
                openModal={this.openModal}
                reinitializeState={this.reinitializeState}
                tabIndex={this.state.tabIndex}
                handleTabChange={this.handleTabChange}
              />
            </div>
            <div className={styles.timeline}>
              <div className={styles.textContainer}>
                <div className={styles.cardTitle}>Timeline & Activities</div>
                <Popover
                  isOpen={this.state.filterOpen}
                  body={[(
                    <FilterTimeline
                      addRemoveFilter={this.addRemoveFilter}
                      defaultEvents={defaultEvents}
                      filters={this.props.filters}
                      clearFilters={this.props.clearAllTimelineFilters}
                      selectAllFilters={this.props.selectAllTimelineFilters}
                    />
                  )]}
                  preferPlace="below"
                  tipSize={0.01}
                  onOuterAction={this.reinitializeState}
                >
                  <div className={styles.textHeader} onClick={this.openFilter}>
                    <div className={styles.textHeader_icon}>
                      <Icon icon="filter" />
                    </div>
                    <div className={styles.textHeader_text}>Filter</div>
                  </div>
                </Popover>
              </div>
              <Timeline
                patientId={patientId}
                filters={this.props.filters}
              />
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

PatientInfo.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  match: PropTypes.instanceOf(Object),
  addRemoveTimelineFilters: PropTypes.func.isRequired,
  selectAllTimelineFilters: PropTypes.func.isRequired,
  clearAllTimelineFilters: PropTypes.func.isRequired,
};

HeaderModalComponent.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    fetchEntitiesRequest,
    updateEntityRequest,
    addRemoveTimelineFilters,
    selectAllTimelineFilters,
    clearAllTimelineFilters,
  }, dispatch);
}

function mapStateToProps({ entities, apiRequests, patientTable, auth }, { match }) {
  const patients = entities.getIn(['patients', 'models']);
  const patientStats = (apiRequests.get('patientIdStats') ? apiRequests.get('patientIdStats').data : null);
  const wasFetched = (apiRequests.get('patientIdStats') ? apiRequests.get('patientIdStats').wasFetched : null);

  const waitForAuth = auth.get('accountId');
  const activeAccount = entities.getIn(['accounts', 'models', waitForAuth]);

  const accountsFetched = (apiRequests.get('accountsPatientInfo') ? apiRequests.get('accountsPatientInfo').wasFetched : null);

  return {
    patient: patients.get(match.params.patientId),
    patientStats,
    wasFetched,
    filters: patientTable.get('timelineFilters'),
    activeAccount,
    accountsFetched,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(PatientInfo);
