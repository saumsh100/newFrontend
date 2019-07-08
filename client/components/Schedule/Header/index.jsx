
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map, List } from 'immutable';
import Popover from 'react-popover';
import moment from 'moment';
import { connect } from 'react-redux';
import { IconButton, Button, DialogBox, SHeader } from '../../library/index';
import Filters from './Filters/index';
import Waitlist from './Waitlist';
import CurrentDate from './CurrentDate';
import { setScheduleView } from '../../../actions/schedule';
import AddToWaitlist from './Waitlist/AddToWaitlist';
import { Delete as DeleteWaitSpot } from '../../GraphQLWaitlist';
import EnabledFeature from '../../library/EnabledFeature';
import styles from './styles.scss';

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
    this.openWaitlist = this.openWaitlist.bind(this);
    this.removeWaitSpot = this.removeWaitSpot.bind(this);
    this.openAddToWaitlist = this.openAddToWaitlist.bind(this);
    this.handleAddToWaitlist = this.handleAddToWaitlist.bind(this);
  }

  componentDidMount() {
    const localStorageView = JSON.parse(localStorage.getItem('scheduleView'));

    if (localStorageView && localStorageView.view !== this.props.scheduleView) {
      const { view } = localStorageView;
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

  openWaitlist() {
    this.setState({ showWaitlist: !this.state.showWaitlist });
  }

  openAddToWaitlist() {
    this.setState({ showAddToWaitlist: !this.state.showAddToWaitlist });
  }

  handleAddToWaitlist() {
    this.openAddToWaitlist();
  }

  removeWaitSpot(deleteMutation) {
    return ({ id }) => {
      const confirmDelete = window.confirm('Are you sure you want to remove this wait spot?');

      if (confirmDelete) {
        deleteMutation({ variables: { input: { id } } });
      }
    };
  }

  toggleFilters() {
    this.setState(prevState => ({ openFilters: !prevState.openFilters }));
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
    } = this.props;

    const leftColumnWidth = schedule.get('leftColumnWidth');
    const scheduleDate = schedule.get('scheduleDate');
    const currentDate = moment(scheduleDate);
    return (
      <SHeader className={styles.headerContainer}>
        <CurrentDate currentDate={currentDate} leftColumnWidth={leftColumnWidth}>
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
              <div className={styles.headerLinks}>
                <IconButton
                  onClick={this.toggleFilters}
                  icon="filter"
                  size={1.2}
                  className={styles.headerLinks_icon}
                />
              </div>
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
              onClick={this.openWaitlist}
              data-test-id="button_headerWaitlist"
            >
              Waitlist
            </Button>

            <Button onClick={this.setView} border="blue" iconRight="exchange" dense compact>
              {scheduleView === 'chair' ? 'Practitioner View' : 'Chair View'}
            </Button>

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

            <DialogBox
              custom
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
            >
              <DeleteWaitSpot>
                {removeCallback => (
                  <Waitlist
                    removeWaitSpot={this.removeWaitSpot(removeCallback)}
                    openAddTo={this.openAddToWaitlist}
                    accountId={this.props.accountId}
                  />
                )}
              </DeleteWaitSpot>
            </DialogBox>
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
  pracsFetched: false,
  chairsFetched: false,
  appointments: List,
};

Header.propTypes = {
  accountId: PropTypes.string.isRequired,
  appointments: PropTypes.objectOf(PropTypes.instanceOf(List)),
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
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
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setScheduleView }, dispatch);
}

const mapStateToProps = ({ auth, schedule, apiRequests }) => {
  const scheduleView = schedule.get('scheduleView');

  const pracsFetched = apiRequests.get('pracSchedule')
    ? apiRequests.get('pracSchedule').wasFetched
    : null;
  const chairsFetched = apiRequests.get('chairsSchedule')
    ? apiRequests.get('chairsSchedule').wasFetched
    : null;

  return {
    accountId: auth.get('accountId'),
    scheduleView,
    pracsFetched,
    chairsFetched,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
