/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import loadable from '@loadable/component';
import { Map, List } from 'immutable';
import Popover from 'react-popover';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  IconButton,
  SHeader,
  Modal,
  getUTCDate,
  Icon,
  EnabledFeature,
  SwitchToggler,
  StandardButton,
  Tooltip,
} from '../../library';
import Filters from './Filters/index';
import Waitlist from './Waitlist';
import { setScheduleView, setWaitlistOpen } from '../../../actions/schedule';
import AddToWaitlist from './Waitlist/AddToWaitlist';
import { Delete as DeleteWaitSpot, MassDelete } from '../../GraphQLWaitlist';
import MicroFrontendRenderer from '../../../micro-front-ends/MicroFrontendRenderer';
import styles from './reskin-styles.scss';

// eslint-disable-next-line import/no-unresolved
const WaitlistMFEComponent = loadable(() => import('WAITLIST_MFE/home'));

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
    this.props.setWaitlistOpen({ waitlistBool: false })
  }

  componentDidUpdate() {
    if (!this.state.showWaitlist && this.props.isOpenWaitlist) {
      this.toggleWaitlist();
    }
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
      waitlistMFEActive,
    } = this.props;

    const scheduleDate = schedule.get('scheduleDate');
    const currentDate = getUTCDate(scheduleDate, timezone);
    const getDateValues = (value) => {
      const mDate = getUTCDate(value, timezone);
      return {
        weekday: mDate.format('dddd'),
        date: mDate.format('DD'),
        month: mDate.format('MMM'),
      };
    };
    const { date, month, weekday } = getDateValues(scheduleDate);
    return (
      <SHeader className={styles.headerContainer}>
        <div className={styles.monthDay}>
          <div className={styles.number}>{date}</div>
          <div className={styles.month}>{month}</div>
        </div>
        <div className={styles.currentDateContainer}>
          <div className={styles.dateSelectors}>
            <div className={styles.container}>
              <div className={styles.dayOfWeek}>{weekday}</div>
            </div>
            <div className={styles.changeDay}>
              <div className={styles.changeDay_left_container}>
                <IconButton
                  icon="angle-left"
                  onClick={() => this.props.previousDay(currentDate)}
                  className={styles.changeDay_left}
                  data-test-id="button_previousDay"
                />
              </div>
              <div className={styles.changeDay_right_container}>
                <IconButton
                  icon="angle-right"
                  onClick={() => this.props.nextDay(currentDate)}
                  className={styles.changeDay_right}
                />
              </div>
            </div>

            <StandardButton
              onClick={() => this.props.setCurrentDay(new Date())}
              variant="secondary"
              className={styles.headerLinks_waitlist}
            >
              Today
            </StandardButton>
          </div>
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
                overlay={
                  <div className={styles.data}>Filter schedule by practitioner or chair</div>
                }
                placement="left"
              >
                <div
                  role="button"
                  className={classNames(styles.headerLinks, styles.filterContainer)}
                  onClick={this.toggleFilters}
                >
                  <StandardButton
                    icon="filter"
                    className={styles.headerLinks_icon}
                    variant="secondary"
                  >
                    <Icon icon="caret-down" className={styles.headerLinks_caretDown} />
                  </StandardButton>
                </div>
              </Tooltip>
            </Popover>

            <EnabledFeature
              predicate={({ userRole }) => userRole === 'SUPERADMIN'}
              render={() => (
                <StandardButton
                  onClick={showSchedule}
                  className={styles.headerLinks_waitlist}
                  variant="secondary"
                >
                  Debug Schedule
                </StandardButton>
              )}
            />

            <StandardButton
              className={styles.headerLinks_waitlist}
              onClick={this.toggleWaitlist}
              data-test-id="button_headerWaitlist"
              variant="secondary"
            >
              Waitlist
            </StandardButton>
            <SwitchToggler
              onChange={this.setView}
              rightLabel="Chair View"
              leftLabel="Practitioner View"
              checked={scheduleView === 'practitioner'}
            />
            <EnabledFeature
              predicate={({ noAppointmentWrite }) => !noAppointmentWrite}
              render={() => (
                <StandardButton
                  onClick={addNewAppointment}
                  className={styles.headerLinks_add}
                  icon="plus"
                  data-test-id="button_appointmentQuickAdd"
                >
                  Quick Add
                </StandardButton>
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
              {waitlistMFEActive && this.state.showWaitlist ? (
                <div className={styles.CCPWaitlistContainer}>
                  <div className={styles.mfeClosingWrapper}>
                    <StandardButton
                      icon="arrow-left"
                      variant="link"
                      title="Back"
                      onClick={this.toggleWaitlist}
                    />
                  </div>
                  <MicroFrontendRenderer
                    load={waitlistMFEActive}
                    className="waitlist-mfe-container"
                    component={<WaitlistMFEComponent />}
                  />
                </div>
              ) : (
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
              )}
            </Modal>
            <AddToWaitlist
              toggleModal={this.openAddToWaitlist}
              active={this.state.showAddToWaitlist}
            />
          </div>
        </div>
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
  waitlistMFEActive: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setScheduleView,
      setWaitlistOpen,
    },
    dispatch,
  );
}
const mapStateToProps = ({ auth, schedule, apiRequests, featureFlags }) => ({
  accountId: auth.get('accountId'),
  scheduleView: schedule.get('scheduleView'),
  pracsFetched: apiRequests.getIn(['pracSchedule', 'wasFetched'], false),
  chairsFetched: apiRequests.getIn(['chairsSchedule', 'wasFetched'], false),
  newWaitlist: featureFlags.getIn(['flags', 'waitlist-2-0']),
  timezone: auth.get('timezone'),
  waitlistMFEActive: featureFlags.getIn(['flags', 'waitlist-mfe-active']),
  isOpenWaitlist: schedule.get('isOpenWaitlist'),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
