
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
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
import { parseDate, SBody, SContainer, SHeader } from '../../library';

class DayViewBody extends Component {
  constructor(props) {
    super(props);

    this.scrollComponentChair = null;
    this.setScrollComponentChair = (element) => {
      this.scrollComponentChair = element;
      if (this.scrollComponentChair) {
        this.scrollComponentChair.addEventListener('scroll', this.onScrollChair);
      }
    };
    this.scrollComponent = null;
    this.setScrollComponent = (element) => {
      this.scrollComponent = element;
      if (this.scrollComponent) {
        this.scrollComponent.addEventListener('scroll', this.onScroll);
      }
    };
    this.headerComponent = createRef();
    this.timeComponent = createRef();

    this.onScroll = this.onScroll.bind(this);
    this.onScrollChair = this.onScrollChair.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { appsFetched, chairsFetched, pracsFetched } = prevProps;
    const allFetched = appsFetched && chairsFetched && pracsFetched;
    const previousDate = parseDate(
      prevProps.schedule.get('scheduleDate'),
      this.props.timezone,
    ).toISOString();
    const currentDate = parseDate(
      this.props.schedule.get('scheduleDate'),
      this.props.timezone,
    ).toISOString();

    if (
      (this.props.scheduleView !== prevProps.scheduleView || currentDate !== previousDate) &&
      allFetched &&
      this.headerComponent.current &&
      this.timeComponent.current
    ) {
      this.headerComponent.current.scrollLeft = 0;
      this.timeComponent.current.scrollTop = 0;
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
    const { scrollTop, scrollLeft } = this.scrollComponent;
    this.headerComponent.current.scrollLeft = scrollLeft;
    this.timeComponent.current.scrollTop = scrollTop;
  }

  onScrollChair() {
    const { scrollTop, scrollLeft } = this.scrollComponentChair;
    this.headerComponent.current.scrollLeft = scrollLeft;
    this.timeComponent.current.scrollTop = scrollTop;
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
      timezone,
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
      if (checkedPractitioners.indexOf(pr.id) > -1) {
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
      timezone,
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
      scrollComponentDidMountChair: this.setScrollComponentChair,
      scrollComponentDidMount: this.setScrollComponent,
    };

    const practitionersSlot = allFetched && <PractitionersSlot {...slotProps} />;

    const chairsSlot = allFetched && <ChairsSlot {...slotProps} />;

    return (
      <SContainer className={styles.card} id="scheduleContainer">
        <SHeader className={styles.header}>
          <ColumnHeader
            scheduleView={scheduleView}
            entities={scheduleView === 'chair' ? chairsArray : practitionersArray}
            headerComponentDidMount={this.headerComponent}
            leftColumnWidth={leftColumnWidth}
            minWidth={schedule.get('columnWidth')}
            schedule={schedule}
            allFetched={allFetched}
          />
        </SHeader>
        <SBody className={styles.dayView}>
          <TimeColumn
            timeSlots={timeSlots}
            timeSlotHeight={timeSlotHeight}
            leftColumnWidth={leftColumnWidth}
            timeComponentDidMount={this.timeComponent}
          />
          {scheduleView === 'chair' ? chairsSlot : practitionersSlot}
        </SBody>
      </SContainer>
    );
  }
}

function mapStateToProps({ schedule, apiRequests, auth }) {
  const scheduleView = schedule.get('scheduleView');

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
  const timezone = auth.get('timezone');

  return {
    scheduleView,
    appsFetched,
    eventsFetched,
    pracsFetched,
    chairsFetched,
    timezone,
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
  timezone: PropTypes.string.isRequired,
};

DayViewBody.defaultProps = {
  appsFetched: false,
  eventsFetched: false,
  pracsFetched: false,
  chairsFetched: false,
};

export default connect(mapStateToProps)(DayViewBody);
