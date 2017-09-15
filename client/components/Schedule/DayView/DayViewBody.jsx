
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TimeColumn from './TimeColumn/TimeColumn';
import TimeSlot from './TimeSlot/index';
import PractitionersSlot from './PractitionersSlot';
import ChairsSlot from './ChairsSlot';
import styles from './styles.scss';
import { SortByFirstName, SortByName } from '../../library/util/SortEntities';

class DayViewBody extends Component {
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
    } = this.props;

    const timeSlots = [];
    for (let i = startHour; i <= endHour; i += 1) {
      timeSlots.push({ position: i });
    }

    const timeSlotHeight = {
      height: '100px',
    };

    // Setting the colors for each practitioner
    const sortedPractitioners = practitioners.toArray().sort(SortByFirstName);

    const colors = ['#FF715A', '#347283', '#2CC4A7', '#FFC45A'];
    const colorLen = colors.length;
    const reset = Math.ceil(( sortedPractitioners.length - colorLen) / colorLen);

    for (let j = 1 ; j <= reset; j++) {
      for (let i = 0; i < (sortedPractitioners.length - colorLen);  i++) {
        colors.push(colors[i]);
      }
    }

    let practitionersArray = sortedPractitioners.map((prac, index) => {
      return Object.assign({}, prac.toJS(), {
        color: colors[index],
        prettyName: prac.getPrettyName(),
      });
    });

    // Display the practitioners that have been checked on the filters card.
    const checkedPractitioners = schedule.toJS().practitionersFilter;
    practitionersArray = practitionersArray.filter((pr) => {
      return checkedPractitioners.indexOf(pr.id) > -1;
    });

    const practitionersSlot = (
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
      />
    );

    // Display chairs that have been selected on the filters
    const checkedChairs = schedule.toJS().chairsFilter;
    const chairsArray = chairs.toArray().sort(SortByName).filter((chair) => {
      return checkedChairs.indexOf(chair.id) > -1;
    });

    const chairsSlot = (
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
      />
    );

    return (
      <div className={styles.dayView_body}>
        <TimeColumn
          timeSlots={timeSlots}
          timeSlotHeight={timeSlotHeight}
        />
        {scheduleView === 'chair' ? chairsSlot : practitionersSlot}
      </div>
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
};


function mapStateToProps({ schedule }) {
  const scheduleView = schedule.toJS().scheduleView;

  return {
    scheduleView,
  };
}

const enhance = connect(mapStateToProps, null)

export default enhance(DayViewBody);
