
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map, List } from 'immutable';
import Popover from 'react-popover';
import moment from 'moment';
import omit from 'lodash/omit';
import { reset } from 'redux-form';
import { connect } from 'react-redux';
import {
  IconButton,
  Button,
  DialogBox,
  SHeader,
  Avatar,
} from '../../library/index';
import Filters from './Filters/index';
import Waitlist from './Waitlist';
import CurrentDate from './CurrentDate';
import { setScheduleView } from '../../../actions/schedule';
import {
  fetchEntitiesRequest,
  deleteEntityRequest,
  createEntityRequest,
} from '../../../thunks/fetchEntities';
import AddToWaitlist from './Waitlist/AddToWaitlist';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import { deleteWaitSpot } from '../../../thunks/waitlist';
import styles from './styles.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilters: false,
      showWaitlist: false,
      showAddToWaitlist: false,
      patientSearched: null,
    };

    this.setView = this.setView.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.openWaitlist = this.openWaitlist.bind(this);
    this.removeWaitSpot = this.removeWaitSpot.bind(this);
    this.openAddToWaitlist = this.openAddToWaitlist.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleAddToWaitlist = this.handleAddToWaitlist.bind(this);
    this.handleAutoSuggest = this.handleAutoSuggest.bind(this);
  }

  componentDidMount() {
    const localStorageView = JSON.parse(localStorage.getItem('scheduleView'));

    if (localStorageView && localStorageView.view !== this.props.scheduleView) {
      const view = localStorageView.view;
      this.props.setScheduleView({ view });
    }
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

  openAddToWaitlist() {
    this.setState(prevState => ({
      showAddToWaitlist: !prevState.showAddToWaitlist,
    }));
  }

  openWaitlist() {
    this.setState(prevState => ({
      showWaitlist: !prevState.showWaitlist,
    }));
  }

  removeWaitSpot(id) {
    const confirmDelete = window.confirm('Are you sure you want to remove this wait spot?');

    if (confirmDelete) {
      this.props.deleteEntityRequest({ key: 'waitSpots', id });
    }
  }

  handleAddToWaitlist(values) {
    const newValues = Object.assign(
      {
        patientId: values.patientData.id,
        endDate: moment()
          .add(1, 'days')
          .toISOString(),
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

    this.props
      .createEntityRequest({
        key: 'waitSpots',
        entityData: newValues,
        alert: alertCreate,
      })
      .then(() => {
        this.openAddToWaitlist();
        this.props.reset('Add to Waitlist Form');
        this.setState({
          patientSearched: null,
        });
      });
  }

  removeWaitSpot(waitSpot) {
    const confirmDelete = confirm('Are you sure you want to remove this wait spot?');

    if (confirmDelete) {
      this.props.deleteWaitSpot(waitSpot);
    }
  }

  getSuggestions(value) {
    return this.props
      .fetchEntitiesRequest({ url: '/api/patients/search', params: { patients: value } })
      .then(searchData => searchData.patients)
      .then((searchedPatients) => {
        const patientList = Object.keys(searchedPatients).length
          ? Object.keys(searchedPatients).map(key => searchedPatients[key])
          : [];

        patientList.map((patient) => {
          patient.display = (
            <div className={styles.suggestionContainer}>
              <Avatar user={patient} size="xs" />
              <div className={styles.suggestionContainer_details}>
                <div className={styles.suggestionContainer_fullName}>
                  {`${patient.firstName} ${patient.lastName}${
                    patient.birthDate ? `, ${moment().diff(patient.birthDate, 'years')}` : ''
                  }`}
                </div>
                <div className={styles.suggestionContainer_date}>
                  Last Appointment:{' '}
                  {patient.lastApptDate ? moment(patient.lastApptDate).format('MMM D YYYY') : 'n/a'}
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
    this.setState(prevState => ({
      openFilters: !prevState.openFilters,
    }));
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
      appointments,
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
              data-test-id="button_previousDay"
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
                    appointments={appointments}
                    currentDate={currentDate}
                  />
                ) : null,
              ]}
              preferPlace="below"
              tipSize={0.01}
              onOuterAction={this.toggleFilters}
            >
              <div className={styles.headerLinks}>
                <IconButton
                  onClick={this.toggleFilters}
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
              data-test-id="button_headerWaitlist"
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
              data-test-id="button_appointmentQuickAdd"
            >
              Quick Add
            </Button>

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
            </DialogBox>
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
                  props: {
                    color: 'blue',
                    form: addToFormName,
                    'data-test-id': 'button_submitForm',
                  },
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setScheduleView,
      fetchEntitiesRequest,
      deleteEntityRequest,
      createEntityRequest,
      reset,
    },
    dispatch,
  );
}

function mapStateToProps({ schedule, apiRequests, entities }) {
  const scheduleObj = schedule.toJS();
  const scheduleView = scheduleObj.scheduleView;

  const pracsFetched = apiRequests.get('pracSchedule')
    ? apiRequests.get('pracSchedule').wasFetched
    : null;
  const chairsFetched = apiRequests.get('chairsSchedule')
    ? apiRequests.get('chairsSchedule').wasFetched
    : null;

  const waitSpots = entities.getIn(['waitSpots', 'models']);
  const patientUsers = entities.getIn(['patientUsers', 'models']);
  const patients = entities.getIn(['patients', 'models']);

  return {
    scheduleView,
    pracsFetched,
    chairsFetched,
    waitSpots,
    patients,
    patientUsers,
  };
}

Header.propTypes = {
  addNewAppointment: PropTypes.func.isRequired,
  scheduleView: PropTypes.string.isRequired,
  setScheduleView: PropTypes.func.isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  chairs: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  waitSpots: PropTypes.instanceOf(Map).isRequired,
  patients: PropTypes.instanceOf(Map).isRequired,
  patientUsers: PropTypes.instanceOf(Map).isRequired,
  appointments: PropTypes.objectOf(PropTypes.instanceOf(List)),
  previousDay: PropTypes.func.isRequired,
  nextDay: PropTypes.func.isRequired,
  setCurrentDay: PropTypes.func.isRequired,
  fetchEntitiesRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
  waitSpotsFetched: PropTypes.bool,
};

Header.defaultProps = {
  pracsFetched: false,
  chairsFetched: false,
  waitSpotsFetched: false,
  appointments: Map,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
