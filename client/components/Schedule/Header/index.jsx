
import { bindActionCreators } from 'redux';
import Popover from 'react-popover';
import moment from 'moment';
import omit from 'lodash/omit';
import { reset } from 'redux-form';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import {
  Icon,
  IconButton,
  Button,
  DialogBox,
  SHeader,
  Avatar
} from '../../library/index';
import styles from './styles.scss';
import Filters from './Filters/index';
import Waitlist from './Waitlist';
import CurrentDate from './CurrentDate';
import { setScheduleView } from '../../../actions/schedule';
import {
  fetchEntitiesRequest,
  deleteEntityRequest ,
  createEntityRequest,
} from '../../../thunks/fetchEntities';
import AddToWaitlist from './Waitlist/AddToWaitlist';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilters: false,
      showWaitlist: false,
      selectedWaitSpot: null,
      showAddToWaitlist: false,
      patientSearched: null,
    };

    this.setView = this.setView.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.openWaitlist = this.openWaitlist.bind(this);
    this.selectWaitSpot = this.selectWaitSpot.bind(this);
    this.removeWaitSpot = this.removeWaitSpot.bind(this);
    this.openAddToWaitlist = this.openAddToWaitlist.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleAddToWaitlist = this.handleAddToWaitlist.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
  }

  componentDidMount() {
    const localStorageView = JSON.parse(localStorage.getItem('scheduleView'));

    if (localStorageView && (localStorageView.view !== this.props.scheduleView)) {
      const view = localStorageView.view;
      this.props.setScheduleView({ view });
    }

    this.props.fetchEntitiesRequest({
      id: 'waitSpots',
      key: 'waitSpots',
      join: ['patientUser', 'patient'],
      params: {
        startTime: moment().toISOString(),
        endTime: moment().add(360, 'days').toISOString(),
      },
    });
  }

  setView() {
    if (this.props.scheduleView === 'chair') {
      const viewObj = { view: 'practitioner' };
      localStorage.setItem('scheduleView', JSON.stringify(viewObj));
      this.props.setScheduleView({ view: 'practitioner' });
    } else {
      const viewObj = { view: 'chair' };
      localStorage.setItem('scheduleView', JSON.stringify(viewObj));
      this.props.setScheduleView({ view: 'chair' });
    }
  }

  openWaitlist() {
    this.setState({
      showWaitlist: !this.state.showWaitlist,
    });
  }

  openAddToWaitlist() {
    this.setState({
      showAddToWaitlist: !this.state.showAddToWaitlist,
    });
  }

  selectWaitSpot(id) {
    this.setState({
      selectedWaitSpot: id,
    });
  }

  handleAddToWaitlist(values) {
    const newValues = Object.assign(
      { patientId: values.patientData.id,
        endDate: moment().add(1, 'days').toISOString(),
      },
      omit(values, ['patientData']),
    );


    const alertCreate = {
      success: {
        body: 'Added Wait Spot.',
      },
      error: {
        title: 'Wait Spot Error',
        body: 'Wait spot could not be added.',
      },
    };

    this.props.createEntityRequest({
      key: 'waitSpots',
      entityData: newValues,
      alert: alertCreate,
    }).then(() => {
      this.openAddToWaitlist();
      this.props.reset('Add to Waitlist Form');
      this.setState({
        patientSearched: null,
      });
    });
  }

  removeWaitSpot(id) {
    const confirmDelete = confirm('Are you sure you want to remove this wait spot?');

    if (confirmDelete) {
      this.props.deleteEntityRequest({ key: 'waitSpots', id });
    }
  }

  getSuggestions(value) {
    return this.props.fetchEntitiesRequest({ url: '/api/patients/search', params: { patients: value } })
      .then((searchData) => searchData.patients).then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length ? Object.keys(searchedPatients).map(
          key => searchedPatients[key]) : [];

        patientList.map((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="xs" />
              <div className={styles.suggestionContainer_details}>
                <div className={styles.suggestionContainer_fullName}>
                  {`${patient.firstName} ${patient.lastName}${patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : ''}`}
                </div>
                <div className={styles.suggestionContainer_date}>
                  Last Appointment: {patient.lastApptDate ? moment(patient.lastApptDate).format('MMM D YYYY') : 'n/a'}
                </div>
              </div>
            </div>
          );
        });

        return patientList;
      });
  }

  handleAutoSuggest(newValue) {
    if (typeof newValue === 'object') {
      this.setState({
        patientSearched: newValue,
      });
    } else if (newValue === '') {
      this.setState({
        patientSearched: '',
      });
    }
  }

  toggleFilters() {
    this.setState({
      openFilters: !this.state.openFilters,
    });
  }

  render() {
    const {
      addNewAppointment,
      scheduleView,
      schedule,
      chairs,
      waitSpots,
      patients,
      patientUsers,
      practitioners,
      pracsFetched,
      chairsFetched,
      waitSpotsFetched,
    } = this.props;

    const leftColumnWidth = schedule.toJS().leftColumnWidth;
    const currentDate = moment(schedule.toJS().scheduleDate);

    const addToFormName = 'Add to Waitlist Form';

    return (
      <SHeader className={styles.headerContainer}>
        <CurrentDate
          currentDate={currentDate}
          leftColumnWidth={leftColumnWidth}
        >
          <div className={styles.changeDay}>
            <IconButton
              icon="angle-left"
              size={1.3}
              onClick={() => this.props.previousDay(currentDate)}
              className={styles.changeDay_left}
            />
            <IconButton
              icon="angle-right"
              size={1.3}
              onClick={() => this.props.nextDay(currentDate)}
              className={styles.changeDay_right}
            />
          </div>

          <Button
            border="blue"
            onClick={() => this.props.setCurrentDay(new Date())}
            dense
            compact
          >
            Today
          </Button>
          <div className={styles.header}>
            <Popover
              isOpen={this.state.openFilters}
              body={[
                pracsFetched && chairsFetched ? (
                  <Filters
                    schedule={schedule}
                    chairs={chairs}
                    practitioners={practitioners}
                  />) : null,
              ]}
              preferPlace="below"
              tipSize={.01}
              onOuterAction={this.toggleFilters}
            >
              <div
                className={styles.headerLinks}
                onClick={this.toggleFilters}
              >
                <Icon
                  icon="filter"
                  size={1.5}
                  className={styles.headerLinks_icon}
                />
              </div>
            </Popover>

            <Button
              border="blue"
              dense
              compact
              className={styles.headerLinks_waitlist}
              onClick={this.openWaitlist}
            >
              Waitlist
            </Button>

            <Button
              onClick={this.setView}
              border="blue"
              iconRight="exchange"
              dense
              compact
            >
              {scheduleView === 'chair' ? 'Practitioner View' : 'Chair View'}
            </Button>

            <Button
              color="blue"
              onClick={addNewAppointment}
              dense
              compact
              className={styles.headerLinks_add}
            >
              Quick Add
            </Button>

            {waitSpotsFetched && waitSpots ? (
              <DialogBox
                title="Waitlist"
                active={this.state.showWaitlist}
                onEscKeyDown={this.openWaitlist}
                onOverlayClick={this.openWaitlist}
                bodyStyles={styles.dialogBodyList}
                actions={[
                  {
                    props: { border: 'blue' },
                    component: Button,
                    onClick: this.openWaitlist,
                    label: 'Cancel',
                  },
                ]}
                custom
              >
                <Waitlist
                  patients={patients}
                  patientUsers={patientUsers}
                  waitSpots={waitSpots}
                  selectWaitSpot={this.selectWaitSpot}
                  removeWaitSpot={this.removeWaitSpot}
                  openAddTo={this.openAddToWaitlist}
                />
              </DialogBox>) : null}
            <DialogBox
              title="Add to Waitlist"
              active={this.state.showAddToWaitlist}
              onEscKeyDown={this.openAddToWaitlist}
              onOverlayClick={this.openAddToWaitlist}
              bodyStyles={styles.dialogBodyAdd}
              actions={[
                {
                  props: { border: 'blue' },
                  component: Button,
                  onClick: this.openAddToWaitlist,
                  label: 'Cancel',
                },
                {
                  props: { color: 'blue', form: addToFormName },
                  component: RemoteSubmitButton,
                  onClick: this.openAddToWaitlist,
                  label: 'Save',
                },
              ]}
              custom
            >
              <AddToWaitlist
                onSubmit={this.handleAddToWaitlist}
                formName={addToFormName}
                getSuggestions={this.getSuggestions}
                handleAutoSuggest={this.handleAutoSuggest}
                patientSearched={this.state.patientSearched}
              />
            </DialogBox>
          </div>
        </CurrentDate>
      </SHeader>
    );
  }
}

Header.PropTypes = {
  addNewAppointment: PropTypes.func,
  runOnDemandSync: PropTypes.func,
  setSyncingWithPMS: PropTypes.func,
  syncingWithPMS: PropTypes.bool,
  scheduleView: PropTypes.string,
  setScheduleView: PropTypes.func,
  schedule: PropTypes.object,
  chairs: PropTypes.object,
  practitioners: PropTypes.object,
  previousDay: PropTypes.func.isRequired,
  nextDay: PropTypes.func.isRequired,
  setCurrentDay: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  reinitializeState: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setScheduleView,
    fetchEntitiesRequest,
    deleteEntityRequest,
    createEntityRequest,
    reset,
  }, dispatch);
}

function mapStateToProps({ schedule, apiRequests, entities }) {
  const scheduleView = schedule.toJS().scheduleView;

  const pracsFetched = (apiRequests.get('pracSchedule') ? apiRequests.get('pracSchedule').wasFetched : null);
  const chairsFetched = (apiRequests.get('chairsSchedule') ? apiRequests.get('chairsSchedule').wasFetched : null);
  const waitSpotsFetched = (apiRequests.get('waitSpots') ? apiRequests.get('waitSpots').wasFetched : null);

  const waitSpots = entities.getIn(['waitSpots', 'models']);
  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const patients = entities.getIn(['patients', 'models']);

  return {
    scheduleView,
    pracsFetched,
    chairsFetched,
    waitSpotsFetched,
    waitSpots,
    patients,
    patientUsers,
  };
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Header);
