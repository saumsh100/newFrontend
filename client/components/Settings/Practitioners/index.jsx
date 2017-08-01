import React, {Component, PropTypes,} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../thunks/fetchEntities';
import PractitionerList from './PractitionerList';
import { Col } from '../../library';
import styles from './styles.scss';


const sortPractitionersAlphabetical = (a, b) => {
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};

class Practitioners extends Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'practitioners', join: ['weeklySchedule', 'services', 'timeOffs', 'recurringTimeOffs'] });
    this.props.fetchEntities({ key: 'services' });
    this.props.fetchEntities({ key: 'chairs' });
  }

  render() {
    const {
      practitioners,
      weeklySchedules,
      timeOffs,
      services,
      recurringTimeOffs,
    } = this.props;

    let showComponent = null;
    if (practitioners) {
      const filteredPractitioners = practitioners.sort(sortPractitionersAlphabetical);
      showComponent = (
        <PractitionerList
          recurringTimeOffs={recurringTimeOffs}
          practitioners={filteredPractitioners}
          weeklySchedules={weeklySchedules}
          timeOffs={timeOffs}
          services={services}
        />
      );
    }

    return (
      <div className={styles.practOuterContainer}>
        {showComponent}
      </div>
    );
  }
}

Practitioners.propTypes = {
  practitioners: PropTypes.object,
  weeklySchedules: PropTypes.object,
  fetchEntities: PropTypes.func,
  timeOffs: PropTypes.object,
  recurringTimeOffs: PropTypes.object,
  services: PropTypes.object,
};

function mapStateToProps({ entities }) {

  const practitioners = entities.getIn(['practitioners', 'models']);

  const weeklyScheduleIds = practitioners.toArray().map((practitioner) => {
    if (practitioner.get('isCustomSchedule')) {
      return practitioner.get('weeklyScheduleId');
    }
  });

  const weeklySchedules = entities.getIn(['weeklySchedules', 'models']).filter((schedule) => {
    return weeklyScheduleIds.indexOf(schedule.get('id')) > -1;
  });

  const allTimeOffs = entities.getIn(['practitionerRecurringTimeOffs', 'models']);

  const timeOffs = allTimeOffs.filter((timeOff) => {
    return !timeOff.toJS().interval;
  });

  const recurringTimeOffs = allTimeOffs.filter((timeOff) => {
    return timeOff.toJS().interval;
  });

  return {
    practitioners,
    weeklySchedules,
    timeOffs,
    recurringTimeOffs,
    services: entities.getIn(['services', 'models'])
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Practitioners);
