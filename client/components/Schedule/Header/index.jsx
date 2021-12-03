import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map, List } from 'immutable';
import Popover from 'react-popover';
import { connect } from 'react-redux';
import { IconButton, Button, SHeader, Modal, getUTCDate } from '../../library/index';
import Filters from './Filters/index';
import Waitlist from './Waitlist';
import CurrentDate from './CurrentDate';
import { setScheduleView } from '../../../actions/schedule';
import AddToWaitlist from './Waitlist/AddToWaitlist';
import { Delete as DeleteWaitSpot, MassDelete } from '../../GraphQLWaitlist';
import EnabledFeature from '../../library/EnabledFeature';
import styles from './styles.scss';
import Tooltip from '../../Tooltip';

const confirmDelete = (ids) =>
  window.confirm(
    `Are you sure you want to remove ${ids.length > 1 ? 'these wait spots' : 'this wait spot'}?`,
  );

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilters: false,
      showWaitlist: false,
      showAddToWaitlist: false,
    };

    this.setView = this.setView.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.toggleWaitlist = this.toggleWaitlist.bind(this);
    this.removeWaitSpot = this.removeWaitSpot.bind(this);
    this.openAddToWaitlist = this.openAddToWaitlist.bind(this);
  }

  componentDidMount() {
    const localStorageView = JSON.parse(localStorage.getItem('scheduleView'));

    if (localStorageView && localStorageView.view !== this.props.scheduleView) {
      this.props.setScheduleView({ ...localStorageView });
    }
  }

  setView() {
    const view = this.props.scheduleView === 'chair' ? 'practitioner' : 'chair';
    localStorage.setItem('scheduleView', JSON.stringify({ view }));
    this.props.setScheduleView({ view });
  }

  toggleWaitlist() {
    this.setState((prevState) => ({
      showWaitlist: !prevState.showWaitlist,
      showAddToWaitlist: prevState.showWaitlist ? false : prevState.showAddToWaitlist,
    }));
  }

  openAddToWaitlist() {
    const { showAddToWaitlist } = this.state;
    this.setState({ showAddToWaitlist: !showAddToWaitlist });
  }

  removeMultipleWaitSpots(deleteMutation) {
    return ({ ids }) => {
      if (confirmDelete(ids)) {
        deleteMutation({ variables: { input: { ids } } });
      }
    };
  }

  removeWaitSpot(deleteMutation) {
    return ({ id }) => {
      if (confirmDelete([id])) {
        deleteMutation({ variables: { input: { id } } });
      }
    };
  }

  toggleFilters() {
    this.setState((prevState) => ({ openFilters: !prevState.openFilters }));
  }

  render() {
    const {
      addNewAppointment,
      showSchedule,
      scheduleView,
      schedule,
      chairs,
      practitioners,
      pracsFetched,
      chairsFetched,
      appointments,
      newWaitlist,
      timezone,
    } = this.props;

    const leftColumnWidth = schedule.get('leftColumnWidth');
    const scheduleDate = schedule.get('scheduleDate');
    const currentDate = getUTCDate(scheduleDate, timezone);

    return (
      <SHeader className={styles.headerContainer}>
        <CurrentDate
          timezone={timezone}
          currentDate={scheduleDate}
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

          <Button border="blue" onClick={() => this.props.setCurrentDay(new Date())} dense compact>
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
              <Tooltip
                trigger={['hover']}
                body={<div className={styles.data}>Filter schedule by practitioner or chair</div>}
                placement="left"
              >
                <div className={styles.headerLinks}>
                  <IconButton
                    dense
                    compact
                    border="blue"
                    onClick={this.toggleFilters}
                    icon="filter"
                    size={1}
                    className={styles.headerLinks_icon}
                  />
                </div>
              </Tooltip>
            </Popover>

            <EnabledFeature
              predicate={({ userRole }) => userRole === 'SUPERADMIN'}
              render={() => (
                <Button
                  dense
                  compact
                  color="blue"
                  onClick={showSchedule}
                  className={styles.headerLinks_waitlist}
                >
                  Debug Schedule
                </Button>
              )}
            />

            <Button
              dense
              compact
              border="blue"
              className={styles.headerLinks_waitlist}
              onClick={this.toggleWaitlist}
              data-test-id="button_headerWaitlist"
            >
              Waitlist
            </Button>

            <Button onClick={this.setView} border="blue" iconRight="exchange" dense compact>
              {scheduleView === 'chair' ? 'Practitioner View' : 'Chair View'}
            </Button>
            <EnabledFeature
              predicate={({ noAppointmentWrite }) => !noAppointmentWrite}
              render={() => (
                <Button
                  dense
                  compact
                  color="blue"
                  onClick={addNewAppointment}
                  className={styles.headerLinks_add}
                  data-test-id="button_appointmentQuickAdd"
                >
                  Quick Add
                </Button>
              )}
            />
            <Modal
              title="Waitlist"
              active={this.state.showWaitlist}
              bodyStyles={styles.dialogBodyList}
              className={styles.waitlistFullScreen}
              onEscKeyDown={this.toggleWaitlist}
              onOverlayClick={this.toggleWaitlist}
              type={newWaitlist ? 'large' : 'medium'}
            >
              <MassDelete>
                {(massRemoveCallback) => (
                  <DeleteWaitSpot>
                    {(removeCallback) => (
                      <Waitlist
                        newWaitlist={newWaitlist}
                        removeWaitSpot={this.removeWaitSpot(removeCallback)}
                        removeMultipleWaitSpots={this.removeMultipleWaitSpots(massRemoveCallback)}
                        openAddTo={this.openAddToWaitlist}
                        accountId={this.props.accountId}
                        onOverlayClick={this.toggleWaitlist}
                      />
                    )}
                  </DeleteWaitSpot>
                )}
              </MassDelete>
            </Modal>
            <AddToWaitlist
              toggleModal={this.openAddToWaitlist}
              active={this.state.showAddToWaitlist}
            />
          </div>
        </CurrentDate>
      </SHeader>
    );
  }
}

Header.defaultProps = {
  appointments: List,
};

Header.propTypes = {
  accountId: PropTypes.string.isRequired,
  appointments: PropTypes.objectOf(PropTypes.instanceOf(List)),
  pracsFetched: PropTypes.bool.isRequired,
  chairsFetched: PropTypes.bool.isRequired,
  addNewAppointment: PropTypes.func.isRequired,
  showSchedule: PropTypes.func.isRequired,
  scheduleView: PropTypes.string.isRequired,
  setScheduleView: PropTypes.func.isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  chairs: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  previousDay: PropTypes.func.isRequired,
  nextDay: PropTypes.func.isRequired,
  setCurrentDay: PropTypes.func.isRequired,
  newWaitlist: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ setScheduleView }, dispatch);

const mapStateToProps = ({ auth, schedule, apiRequests, featureFlags }) => ({
  accountId: auth.get('accountId'),
  scheduleView: schedule.get('scheduleView'),
  pracsFetched: apiRequests.getIn(['pracSchedule', 'wasFetched'], false),
  chairsFetched: apiRequests.getIn(['chairsSchedule', 'wasFetched'], false),
  newWaitlist: featureFlags.getIn(['flags', 'waitlist-2-0']),
  timezone: auth.get('timezone'),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
