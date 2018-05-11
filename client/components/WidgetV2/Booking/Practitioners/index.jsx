
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '../../../library/Link';
import WidgetCard from '../../../library/WidgetCard';
import practitioners from '../../../../entities/collections/practitioners';
import { setSelectedPractitionerId } from '../../../../actions/availabilities';
import styles from './styles.scss';

function Practitioners({ practitionersEntity, selectedPractitionerId, setSelectedPractitioner }) {
  /**
   * List of only active and not hidden practitioners
   * containing their name value and type.
   */
  const practitionerList = practitionersEntity
    .get('models')
    .filter(prac => prac.get('isActive') && !prac.get('isHidden'))
    .reduce(
      (acc, actual) => [
        ...acc,
        {
          value: actual.get('id'),
          label: actual.getPrettyName(),
          description: actual.get('type'),
        },
      ],
      [{ label: 'No Preference', value: '' }]
    );

  return (
    <div className={styles.container}>
      {practitionerList.map(prac => (
        <Link to={'./reason'} key={prac.value} className={styles.link}>
          <WidgetCard
            title={prac.label}
            description={prac.description}
            arrow
            onClick={() => setSelectedPractitioner(prac.value)}
            selected={prac.value === selectedPractitionerId}
          />
        </Link>
      ))}
    </div>
  );
}

function mapStateToProps({ entities, availabilities }) {
  return {
    practitionersEntity: entities.get('practitioners'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSelectedPractitioner: setSelectedPractitionerId,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Practitioners);

Practitioners.propTypes = {
  practitionersEntity: PropTypes.instanceOf(practitioners),
  selectedPractitionerId: PropTypes.string,
  setSelectedPractitioner: PropTypes.func.isRequired,
};
