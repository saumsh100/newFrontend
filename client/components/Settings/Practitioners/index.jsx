
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../thunks/fetchEntities';
import PractitionerList from './PractitionerList';
import { practitionerShape } from '../../library/PropTypeShapes';
import PractitionerRecurringTimeOff from '../../../entities/models/PractitionerRecurringTimeOff';
import Service from '../../../entities/models/Service';
import styles from './styles.scss';

const sortPractitionersAlphabetical = (a, b) => {
  if (!a.firstName || !b.firstName) return -1;
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};

class Practitioners extends Component {
  componentWillMount() {
    this.props.fetchEntities({ key: 'practitioners' });
    this.props.fetchEntities({ key: 'services' });
    this.props.fetchEntities({ key: 'chairs' });
  }

  render() {
    const { practitioners, services, recurringTimeOffs } = this.props;
    let showComponent = null;
    if (practitioners) {
      const filteredPractitioners = practitioners
        .sort(sortPractitionersAlphabetical)
        .filter(practitioner => practitioner.isActive);
      showComponent = (
        <PractitionerList
          recurringTimeOffs={recurringTimeOffs}
          practitioners={filteredPractitioners}
          services={services}
        />
      );
    }

    return <div className={styles.practOuterContainer}>{showComponent}</div>;
  }
}

Practitioners.propTypes = {
  practitioners: PropTypes.arrayOf(PropTypes.shape(practitionerShape)).isRequired,
  fetchEntities: PropTypes.func.isRequired,
  recurringTimeOffs: PropTypes.arrayOf(PropTypes.instanceOf(PractitionerRecurringTimeOff))
    .isRequired,
  services: PropTypes.instanceOf(Service).isRequired,
};

function mapStateToProps({ entities }) {
  return {
    practitioners: entities.getIn(['practitioners', 'models']),
    services: entities.getIn(['services', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default enhance(Practitioners);
