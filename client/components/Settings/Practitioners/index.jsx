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
    this.props.fetchEntities({ key: 'practitioners', join: ['weeklySchedule', 'services', 'timeOffs'] });
    this.props.fetchEntities({ key: 'services' });
  }

  render() {
    const { practitioners, weeklySchedules, timeOffs } = this.props;

    let showComponent = null;
    if (practitioners) {
      const filteredPractitioners = practitioners.sort(sortPractitionersAlphabetical);
      showComponent = (
        <PractitionerList
          practitioners={filteredPractitioners}
          weeklySchedules={weeklySchedules}
          timeOffs={timeOffs}
        />
      );
    }

    return (
      <Col xs={12}>
        {showComponent}
      </Col>
    );
  }
}

Practitioners.propTypes = {
  practitioners: PropTypes.object,
  weeklySchedules: PropTypes.object,
  fetchEntities: PropTypes.func,
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

  const timeOffs = entities.getIn(['timeOffs', 'models']);

  return {
    practitioners,
    weeklySchedules,
    timeOffs,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Practitioners);
