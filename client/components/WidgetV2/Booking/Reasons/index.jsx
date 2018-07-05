
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '../../../library/Link';
import WidgetCard from '../../../library/WidgetCard';
import { setSelectedServiceId } from '../../../../actions/availabilities';
import services from '../../../../entities/collections/services';
import { locationShape } from '../../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

function Reasons({
  servicesEntity, selectedServiceId, setSelectedService, location,
}) {
  /**
   * List of only active and not hidden practitioners
   * containing their name value and type.
   */
  const servicesList = servicesEntity.get('models').reduce(
    (acc, actual) => [
      ...acc,
      {
        label: actual.get('name'),
        value: actual.get('id'),
      },
    ],
    [],
  );

  /**
   * Checks if there are a specific route to go onclicking a card or just the default one.
   */
  const contextualUrl = (location.state && location.state.nextRoute) || './practitioner';
  return (
    <div className={styles.container}>
      {!servicesList.length ? (
        <div className={styles.subCard}>
          <div className={styles.subCardWrapper}>
            <h3 className={styles.subCardTitle}>You still have some configuration to do.</h3>
            <p className={styles.subCardSubtitle}>
              It looks like you did not assign service to the selected practitioner.
            </p>
          </div>
        </div>
      ) : (
        servicesList.map(service => (
          <Link to={contextualUrl} key={`reason_${service.value}`} className={styles.cardLink}>
            <WidgetCard
              arrow
              title={service.label}
              selected={service.value === selectedServiceId}
              onClick={() => setSelectedService(service.value)}
            />
          </Link>
        ))
      )}
    </div>
  );
}

function mapStateToProps({ entities, availabilities }) {
  return {
    selectedServiceId: availabilities.get('selectedServiceId'),
    servicesEntity: entities.get('services'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSelectedService: setSelectedServiceId,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Reasons);

Reasons.propTypes = {
  location: PropTypes.shape(locationShape).isRequired,
  selectedServiceId: PropTypes.string.isRequired,
  servicesEntity: PropTypes.instanceOf(services).isRequired,
  setSelectedService: PropTypes.func.isRequired,
};
