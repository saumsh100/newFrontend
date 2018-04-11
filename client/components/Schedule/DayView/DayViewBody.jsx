
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import TimeColumn from './TimeColumn/TimeColumn';
import PractitionersSlot from './PractitionersSlot';
import ColumnHeader from './ColumnHeader/index';
import ChairsSlot from './ChairsSlot';
import styles from './styles.scss';
import { SortByFirstName, SortByName } from '../../library/util/SortEntities';
import { Card, SContainer, SBody, SHeader } from '../../library';

class DayViewBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removed: false,
    };
    this.scrollComponentDidMount = this.scrollComponentDidMount.bind(this);
    this.scrollComponentDidMountChair = this.scrollComponentDidMountChair.bind(this);
    this.headerComponentDidMount = this.headerComponentDidMount.bind(this);
    this.timeComponentDidMount = this.timeComponentDidMount.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onScrollChair = this.onScrollChair.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      appsFetched,
      chairsFetched,
      pracsFetched,
    } = this.props;

    const allFetched = appsFetched && chairsFetched && pracsFetched;

    const currentDate = moment(this.props.schedule.get('scheduleDate'));
    const nextDate = moment(nextProps.schedule.get('scheduleDate'));

    if (((nextProps.scheduleView !== this.props.scheduleView)
      || (currentDate.toISOString() !== nextDate.toISOString())) && allFetched) {
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
      services,
      chairs,
      selectAppointment,
      scheduleView,
      leftColumnWidth,
      appsFetched,
      chairsFetched,
      pracsFetched,
    } = this.props;

    const allFetched = appsFetched && chairsFetched && pracsFetched;

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

    for (let j = 1; j <= reset; j++) {
      for (let i = 0; i < (sortedPractitioners.length - colorLen); i++) {
        colors.push(colors[i]);
      }
    }

    let practitionersArray = sortedPractitioners.map((prac, index) => Object.assign({}, prac.toJS(), {
      color: colors[index],
      prettyName: prac.getPrettyName(),
    }));

    // Display the practitioners that have been checked on the filters card.
    const checkedPractitioners = schedule.toJS().practitionersFilter;
    practitionersArray = practitionersArray.filter(pr => checkedPractitioners.indexOf(pr.id) > -1 && pr.isActive);

    const practitionersSlot = allFetched ? (
      <PractitionersSlot
        timeSlots={timeSlots}
        timeSlotHeight={timeSlotHeight}
        practitionersArray={practitionersArray}
        startHour={startHour}
        endHour={endHour}
        schedule={schedule}
        patients={patients}
        appointments={appointments}
        services={services}
        chairs={chairs}
        selectAppointment={selectAppointment}
        scrollComponentDidMount={this.scrollComponentDidMount}
      />
    ) : null;

    // Display chairs that have been selected on the filters
    const checkedChairs = schedule.toJS().chairsFilter;
    const chairsArray = chairs.toArray().sort(SortByName).filter(chair => checkedChairs.indexOf(chair.id) > -1 && chair.isActive);

    const chairsSlot = allFetched ? (
      <ChairsSlot
        timeSlots={timeSlots}
        timeSlotHeight={timeSlotHeight}
        practitionersArray={practitionersArray}
        chairsArray={chairsArray}
        startHour={startHour}
        endHour={endHour}
        schedule={schedule}
        patients={patients}
        appointments={appointments}
        services={services}
        chairs={chairs}
        practitioners={practitioners}
        selectAppointment={selectAppointment}
        scrollComponentDidMountChair={this.scrollComponentDidMountChair}
      />
    ) : null;

    return (
      <SContainer noBorder className={styles.card} id="scheduleContainer">
        <SHeader className={styles.header}>
         <ColumnHeader
            scheduleView={scheduleView}
            entities={scheduleView === 'chair' ? chairsArray : practitionersArray}
            headerComponentDidMount={this.headerComponentDidMount}
            leftColumnWidth={leftColumnWidth}
            minWidth={schedule.toJS().columnWidth}
            headerComponent={this.headerComponent}
            schedule={schedule}
            allFetched={allFetched}
          />
        </SHeader>
        <SBody className={styles.dayView} >
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

DayViewBody.propTypes = {
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  appointments: PropTypes.arrayOf(PropTypes.object),
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
  practitioners: PropTypes.object.isRequired,
  schedule: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
  scheduleView: PropTypes.string.isRequired,
  leftColumnWidth: PropTypes.number,
  appsFetched: PropTypes.bool,
  pracsFetched: PropTypes.bool,
  chairsFetched: PropTypes.bool,
};


function mapStateToProps({ schedule, apiRequests }) {
  const scheduleView = schedule.toJS().scheduleView;

  const appsFetched = (apiRequests.get('appSchedule') ? apiRequests.get('appSchedule').wasFetched : null);
  const pracsFetched = (apiRequests.get('pracSchedule') ? apiRequests.get('pracSchedule').wasFetched : null);
  const chairsFetched = (apiRequests.get('chairsSchedule') ? apiRequests.get('chairsSchedule').wasFetched : null);

  return {
    scheduleView,
    appsFetched,
    pracsFetched,
    chairsFetched,
  };
}

const enhance = connect(mapStateToProps, null);

export default enhance(DayViewBody);
