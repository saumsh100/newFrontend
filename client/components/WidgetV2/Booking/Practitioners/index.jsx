
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WidgetCard from '../../../library/WidgetCard';
import PractitionerAvatar from '../../../library/PractitionerAvatar';
import practitioners from '../../../../entities/collections/practitioners';
import { setSelectedPractitionerId } from '../../../../reducers/availabilities';
import { setAvailabilities, setNextAvailability } from '../../../../actions/availabilities';
import { locationShape, historyShape } from '../../../library/PropTypeShapes/routerShapes';
import services from '../../../../entities/collections/services';
import styles from './styles.scss';

function Practitioners({
  practitionersEntity,
  selectedPractitionerId,
  servicesEntity,
  selectedServiceId,
  location,
  history,
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
          fullAvatarUrl: actual.get('fullAvatarUrl'),
          firstName: actual.get('firstName'),
          lastName: actual.get('lastName'),
        },
      ],
      [
        {
          label: 'No Preference',
          value: '',
        },
      ],
    );
  /**
   * Checks if there are a specific route to go onclicking a card or just the default one.
   */
  const contextualUrl = {
    ...location,
    pathname: './date-and-time',
  };

  const selectPractitioner = (practitioner) => {
    if (selectedPractitionerId !== practitioner) {
      props.setAvailabilities([]);
      props.setNextAvailability(null);
    }
    props.setSelectedPractitionerId(practitioner);
    return history.push(contextualUrl);
  };

  const imageComponent = practitioner => defaultComponent => (
    <div className={styles.imageWrapper}>
      <div className={styles.avatarWrapper}>
        <PractitionerAvatar practitioner={practitioner} className={styles.avatarSize} />
      </div>
      <span className={styles.componentWrapper}>{defaultComponent}</span>
    </div>
  );

  return (
    <div className={styles.cardContainer}>
      {practitionerIds.length > 0 ? (
        <div className={styles.contentWrapper}>
          <h1 className={styles.heading}>Select Practitioner</h1>
          <div className={styles.cardsWrapper}>
            {practitionerList.map(prac => (
              <span className={styles.cardWrapper} key={prac.value}>
                <WidgetCard
                  title={prac.label}
                  description={prac.description}
                  onClick={() => selectPractitioner(prac.value)}
                  selected={prac.value === selectedPractitionerId}
                  imageComponent={prac.label !== 'No Preference' ? imageComponent(prac) : null}
                />
              </span>
            ))}
          </div>
        </div>
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
      setAvailabilities,
      setNextAvailability,
    },
    dispatch,
  );
}

Practitioners.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  practitionersEntity: PropTypes.instanceOf(practitioners).isRequired,
  selectedPractitionerId: PropTypes.string,
  selectedServiceId: PropTypes.string,
  servicesEntity: PropTypes.instanceOf(services).isRequired,
  setAvailabilities: PropTypes.func.isRequired,
  setNextAvailability: PropTypes.func.isRequired,
  setSelectedPractitionerId: PropTypes.func.isRequired,
};

Practitioners.defaultProps = {
  selectedPractitionerId: '',
  selectedServiceId: '',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Practitioners);
