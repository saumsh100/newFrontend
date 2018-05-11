
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from '../../../library/Link';
import WidgetCard from '../../../library/WidgetCard';
import { setSelectedServiceId } from '../../../../actions/availabilities';
import services from '../../../../entities/collections/services';
import styles from './styles.scss';

function Reasons({ servicesEntity, selectedServiceId, setSelectedService }) {
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
    []
  );

  return (
    <div className={styles.container}>
      {servicesList.map((service, i) => (
        <Link to={'./date-and-time'} key={`reason_${i}`} className={styles.cardLink}>
          <WidgetCard
            title={service.label}
            description="Lorem ipsum dolor"
            centered
            square
            onClick={() => setSelectedService(service.value)}
            selected={service.value === selectedServiceId}
          />
        </Link>
      ))}
    </div>
  );
}

function mapStateToProps({ entities, availabilities }) {
  return {
    servicesEntity: entities.get('services'),
    selectedServiceId: availabilities.get('selectedServiceId'),
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
  servicesEntity: PropTypes.instanceOf(services),
  selectedServiceId: PropTypes.string,
  setSelectedService: PropTypes.func.isRequired,
};
