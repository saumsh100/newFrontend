
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '../../../library/Link';
import WidgetCard from '../../../library/WidgetCard';
import practitioners from '../../../../entities/collections/practitioners';
import { setSelectedPractitionerId } from '../../../../actions/availabilities';
import { locationShape } from '../../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

function Practitioners({
  practitionersEntity, selectedPractitionerId, location, ...props
}) {
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
      [{ label: 'No Preference', value: '' }],
    );
  /**
   * Checks if there are a specific route to go onclicking a card or just the default one.
   */
  const contextualUrl = (location.state && location.state.nextRoute) || './reason';

  return (
    <div className={styles.container}>
      {practitionerList.map(prac => (
        <Link to={contextualUrl} key={prac.value} className={styles.link}>
          <WidgetCard
            title={prac.label}
            description={prac.description}
            arrow
            onClick={() => props.setSelectedPractitionerId(prac.value)}
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
      setSelectedPractitionerId,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Practitioners);

Practitioners.propTypes = {
  practitionersEntity: PropTypes.instanceOf(practitioners).isRequired,
  selectedPractitionerId: PropTypes.string,
  location: PropTypes.shape(locationShape).isRequired,
  setSelectedPractitionerId: PropTypes.func.isRequired,
};

Practitioners.defaultProps = {
  selectedPractitionerId: '',
};
