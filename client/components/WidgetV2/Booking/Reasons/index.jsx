
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '../../../library/Link';
import WidgetCard from '../../../library/WidgetCard';
import { setSelectedServiceId } from '../../../../actions/availabilities';
import services from '../../../../entities/collections/services';
import styles from './styles.scss';

function Reasons({
  servicesEntity,
  selectedServiceId,
  setSelectedService,
  selectedPractitionerId,
}) {
  /**
   * List of only active and not hidden practitioners
   * containing their name value and type.
   */
  const servicesList = servicesEntity.get('models').reduce((acc, actual) => {
    if (!selectedPractitionerId || actual.get('practitioners').includes(selectedPractitionerId)) {
      return [
        ...acc,
        {
          label: actual.get('name'),
          value: actual.get('id'),
        },
      ];
    }
    return acc;
  }, []);

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
        servicesList.map((service, i) => (
          <Link to={'./date-and-time'} key={`reason_${i}`} className={styles.cardLink}>
            <WidgetCard
              arrow
              title={service.label}
              selected={service.value === selectedServiceId}
              onClick={() => setSelectedService(service.value)}
              description="Lorem Ipsum is simply dummy text of the."
            />
          </Link>
        ))
      )}
    </div>
  );
}

function mapStateToProps({ entities, availabilities }) {
  return {
    servicesEntity: entities.get('services'),
    selectedServiceId: availabilities.get('selectedServiceId'),
    selectedPractitionerId: availabilities.get('selectedPractitionerId'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSelectedService: setSelectedServiceId,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Reasons);

Reasons.propTypes = {
  selectedPractitionerId: PropTypes.string,
  selectedServiceId: PropTypes.string,
  servicesEntity: PropTypes.instanceOf(services),
  setSelectedService: PropTypes.func.isRequired,
};
