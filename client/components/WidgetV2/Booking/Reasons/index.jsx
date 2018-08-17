
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WidgetCard from '../../../library/WidgetCard';
import { setSelectedServiceId } from '../../../../reducers/availabilities';
import { setAvailabilities, setNextAvailability } from '../../../../actions/availabilities';
import services from '../../../../entities/collections/services';
import { locationShape, historyShape } from '../../../library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

function Reasons({ servicesEntity, selectedServiceId, location, history, ...props }) {
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
  const contextualUrl = {
    ...location,
    pathname: './practitioner',
  };

  const selectReason = (reason) => {
    if (selectedServiceId !== reason) {
      props.setAvailabilities([]);
      props.setNextAvailability(null);
    }
    props.setSelectedServiceId(reason);
    return history.push(contextualUrl);
  };
  return (
    <div className={styles.cardContainer}>
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
        <div className={styles.contentWrapper}>
          <h1 className={styles.heading}>Select Reason</h1>
          <div className={styles.cardsWrapper}>
            {servicesList.map(service => (
              <span className={styles.cardWrapper} key={service.value}>
                <WidgetCard
                  title={service.label}
                  selected={service.value === selectedServiceId}
                  onClick={() => selectReason(service.value)}
                />
              </span>
            ))}
          </div>
        </div>
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
      setSelectedServiceId,
      setAvailabilities,
      setNextAvailability,
    },
    dispatch,
  );
}

Reasons.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  selectedServiceId: PropTypes.string,
  servicesEntity: PropTypes.instanceOf(services).isRequired,
  setAvailabilities: PropTypes.func.isRequired,
  setNextAvailability: PropTypes.func.isRequired,
  setSelectedServiceId: PropTypes.func.isRequired,
};

Reasons.defaultProps = { selectedServiceId: '' };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reasons);
