
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '../../../library/Link';
import WidgetCard from '../../../library/WidgetCard';
import practitioners from '../../../../entities/collections/practitioners';
import { setSelectedPractitionerId } from '../../../../actions/availabilities';
import { locationShape } from '../../../library/PropTypeShapes/routerShapes';
import services from '../../../../entities/collections/services';
import styles from './styles.scss';

function Practitioners({
  practitionersEntity,
  selectedPractitionerId,
  servicesEntity,
  selectedServiceId,
  location,
  ...props
}) {
  /**
   * List of only active and not hidden practitioners
   * containing their name value and type.
   */
  const practitionerIds = servicesEntity
    .get('models')
    .filter(service => service.get('id') === selectedServiceId)
    .reduce((acc, actual) => [...acc, ...actual.get('practitioners')], []);
  const practitionerList = practitionersEntity
    .get('models')
    .filter(prac =>
      prac.get('isActive') && !prac.get('isHidden') && practitionerIds.includes(prac.get('id')))
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
  const contextualUrl = (location.state && location.state.nextRoute) || './date-and-time';

  return (
    <div className={styles.container}>
      {practitionerIds.length > 0 ? (
        practitionerList.map(prac => (
          <Link to={contextualUrl} key={prac.value} className={styles.link}>
            <WidgetCard
              title={prac.label}
              description={prac.description}
              arrow
              onClick={() => props.setSelectedPractitionerId(prac.value)}
              selected={prac.value === selectedPractitionerId}
            />
          </Link>
        ))
      ) : (
        <div className={styles.subCard}>
          <div className={styles.subCardWrapper}>
            <h3 className={styles.subCardTitle}>You still have some configuration to do.</h3>
            <p className={styles.subCardSubtitle}>
              It looks like you did not assigned any practitioner to the selected reason.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function mapStateToProps({ entities, availabilities }) {
  return {
    servicesEntity: entities.get('services'),
    practitionersEntity: entities.get('practitioners'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
    selectedServiceId: availabilities.get('selectedServiceId'),
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
  selectedServiceId: PropTypes.string.isRequired,
  servicesEntity: PropTypes.instanceOf(services).isRequired,
};

Practitioners.defaultProps = {
  selectedPractitionerId: '',
};
