
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Appointment from '../../../entities/models/Appointments';
import Event from '../../../entities/models/Event';
import TimeColumn from './TimeColumn/TimeColumn';
import PractitionersSlot from './PractitionersSlot';
import ColumnHeader from './ColumnHeader/index';
import ChairsSlot from './ChairsSlot';
import styles from './styles.scss';
import { SortByFirstName, SortByName } from '../../library/util/SortEntities';
import { SContainer, SBody, SHeader } from '../../library';

class DayViewBody extends Component {
  constructor(props) {
    super(props);
    this.scrollComponentDidMount = this.scrollComponentDidMount.bind(this);
    this.scrollComponentDidMountChair = this.scrollComponentDidMountChair.bind(this);
    this.headerComponentDidMount = this.headerComponentDidMount.bind(this);
    this.timeComponentDidMount = this.timeComponentDidMount.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onScrollChair = this.onScrollChair.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { appsFetched, chairsFetched, pracsFetched } = this.props;

    const allFetched = appsFetched && chairsFetched && pracsFetched;

    const currentDate = moment(this.props.schedule.get('scheduleDate'));
    const nextDate = moment(nextProps.schedule.get('scheduleDate'));

    if (
      (nextProps.scheduleView !== this.props.scheduleView ||
        currentDate.toISOString() !== nextDate.toISOString()) &&
      allFetched
    ) {
      this.headerComponent.scrollLeft = 0;
    }
  }

  componentWillUnmount() {
    if (this.scrollComponentChair) {
      this.scrollComponentChair.removeEventListener('scroll', this.onScrollChair.bind(this));
    } else if (this.scrollComponent) {
      this.scrollComponent.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onScroll() {
    const scrollTop = this.scrollComponent.scrollTop;
    const scrollLeft = this.scrollComponent.scrollLeft;
    this.headerComponent.scrollLeft = scrollLeft;
    this.timeComponent.scrollTop = scrollTop;
  }

  onScrollChair() {
    const scrollTop = this.scrollComponentChair.scrollTop;
    const scrollLeft = this.scrollComponentChair.scrollLeft;
    this.headerComponent.scrollLeft = scrollLeft;
    this.timeComponent.scrollTop = scrollTop;
  }

  scrollComponentDidMount(node) {
    if (this.props.scheduleView === 'practitioner' && node) {
      this.scrollComponent = node;
      this.scrollComponent.addEventListener('scroll', this.onScroll);
    }
  }

  scrollComponentDidMountChair(node) {
    if (this.props.scheduleView === 'chair' && node) {
      this.scrollComponentChair = node;
      this.scrollComponentChair.addEventListener('scroll', this.onScrollChair);
    }
  }

  headerComponentDidMount(node) {
    this.headerComponent = node;
  }

  timeComponentDidMount(node) {
    this.timeComponent = node;
  }

  render() {
    const {
      startHour,
      endHour,
      schedule,
      practitioners,
      patients,
      appointments,
      events,
      services,
      chairs,
      selectAppointment,
      scheduleView,
      leftColumnWidth,
      appsFetched,
      eventsFetched,
      chairsFetched,
      pracsFetched,
    } = this.props;

    const allFetched = appsFetched && eventsFetched && chairsFetched && pracsFetched;

    const timeSlots = [];
    for (let i = startHour; i <= endHour; i += 1) {
      timeSlots.push({ position: i });
    }

    const timeSlotHeight = {
      height: schedule.get('timeSlotHeight'),
    };

    // Setting the colors for each practitioner
    const sortedPractitioners = practitioners.toArray().sort(SortByFirstName);

    const colors = ['#FF715A', '#347283', '#FFC45A', '#2CC4A7'];
    const colorLen = colors.length;
    const reset = Math.ceil((sortedPractitioners.length - colorLen) / colorLen);

    for (let j = 1; j <= reset; j += 1) {
      for (let i = 0; i < sortedPractitioners.length - colorLen; i += 1) {
        colors.push(colors[i]);
      }
    }

    let practitionersArray = sortedPractitioners.map((prac, index) =>
      Object.assign({}, prac.toJS(), {
        color: colors[index],
        prettyName: prac.getPrettyName(),
      }));

    // Display the practitioners that have been checked on the filters card.
    const checkedPractitioners = schedule.get('practitionersFilter');
    practitionersArray = practitionersArray.filter((pr) => {
      if (checkedPractitioners.indexOf(pr.id) > -1 && pr.isActive) {
        return pr;
      }
      return null;
    });

    // Display chairs that have been selected on the filters
    const checkedChairs = schedule.get('chairsFilter');
    const chairsArray = chairs
      .toArray()
      .sort(SortByName)
      .filter(chair => checkedChairs.indexOf(chair.id) > -1 && chair.isActive);

    const slotProps = {
      timeSlots,
      timeSlotHeight,
      startHour,
      endHour,
      schedule,
      patients,
      appointments,
      events,
      services,
      chairs,
      selectAppointment,
      practitioners,
      practitionersArray,
      chairsArray,
      scrollComponentDidMountChair: this.scrollComponentDidMountChair,
      scrollComponentDidMount: this.scrollComponentDidMount,
    };

    const practitionersSlot = allFetched && <PractitionersSlot {...slotProps} />;

    const chairsSlot = allFetched && <ChairsSlot {...slotProps} />;

    return (
      <SContainer className={styles.card} id="scheduleContainer">
        <SHeader className={styles.header}>
          <ColumnHeader
            scheduleView={scheduleView}
            entities={scheduleView === 'chair' ? chairsArray : practitionersArray}
            headerComponentDidMount={this.headerComponentDidMount}
            leftColumnWidth={leftColumnWidth}
            minWidth={schedule.get('columnWidth')}
            headerComponent={this.headerComponent}
            schedule={schedule}
            allFetched={allFetched}
          />
        </SHeader>
        <SBody className={styles.dayView}>
          <TimeColumn
            timeSlots={timeSlots}
            timeSlotHeight={timeSlotHeight}
            leftColumnWidth={leftColumnWidth}
            timeComponentDidMount={this.timeComponentDidMount}
          />
          {scheduleView === 'chair' ? chairsSlot : practitionersSlot}
        </SBody>
      </SContainer>
    );
  }
}

function mapStateToProps({ schedule, apiRequests }) {
  const scheduleView = schedule.toJS().scheduleView;

  const appsFetched = apiRequests.get('appSchedule')
    ? apiRequests.get('appSchedule').wasFetched
    : null;
  const eventsFetched = apiRequests.get('eventsSchedule')
    ? apiRequests.get('eventsSchedule').wasFetched
    : null;
  const pracsFetched = apiRequests.get('pracSchedule')
    ? apiRequests.get('pracSchedule').wasFetched
    : null;
  const chairsFetched = apiRequests.get('chairsSchedule')
    ? apiRequests.get('chairsSchedule').wasFetched
    : null;

  return {
    scheduleView,
    appsFetched,
    eventsFetched,
    pracsFetched,
    chairsFetched,
  };
}

DayViewBody.propTypes = {
  startHour: PropTypes.number.isRequired,
  endHour: PropTypes.number.isRequired,
  appointments: PropTypes.arrayOf(PropTypes.instanceOf(Appointment)).isRequired,
  events: PropTypes.arrayOf(PropTypes.instanceOf(Event)).isRequired,
  patients: PropTypes.instanceOf(Map).isRequired,
  services: PropTypes.instanceOf(Map).isRequired,
  chairs: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  schedule: PropTypes.instanceOf(Map).isRequired,
  selectAppointment: PropTypes.func.isRequired,
  scheduleView: PropTypes.string.isRequired,
  leftColumnWidth: PropTypes.number.isRequired,
  appsFetched: PropTypes.bool,
  eventsFetched: PropTypes.bool,
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
};

DayViewBody.defaultProps = {
  appsFetched: false,
  eventsFetched: false,
  pracsFetched: false,
  chairsFetched: false,
};

export default connect(mapStateToProps)(DayViewBody);
