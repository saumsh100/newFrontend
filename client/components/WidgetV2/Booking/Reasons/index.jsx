
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WidgetCard from '../../../library/WidgetCard';
import { setSelectedServiceId } from '../../../../reducers/availabilities';
import { setAvailabilities, setNextAvailability } from '../../../../actions/availabilities';
import { locationShape, historyShape } from '../../../library/PropTypeShapes/routerShapes';
import { hideButton } from '../../../../reducers/widgetNavigation';
import styles from './styles.scss';

class Reasons extends Component {
  constructor() {
    super();
    this.selectReason = this.selectReason.bind(this);
  }

  componentDidMount() {
    this.props.hideButton();
  }

  /**
   * Handle the selection of a Reason.
   *
   * @param reason
   * @returns {*}
   */
  selectReason(reason = '') {
    const { selectedServiceId, location, history } = this.props;

    if (selectedServiceId !== reason) {
      this.props.setAvailabilities([]);
      this.props.setNextAvailability(null);
    }
    this.props.setSelectedServiceId(reason);
    return history.push({
      ...location,
      pathname: './practitioner',
    });
  }

  render() {
    const { serviceList, selectedServiceId } = this.props;

    // Fallback if we have no services assigned/configured
    const serviceNotAssigned = (
      <div className={styles.subCard}>
        <div className={styles.subCardWrapper}>
          <h3 className={styles.subCardTitle}>You still have some configuration to do.</h3>
          <p className={styles.subCardSubtitle}>
            It looks like you did not assign a reason to any practitioner.
          </p>
        </div>
      </div>
    );

    return (
      <div className={styles.cardContainer}>
        {!serviceList.length ? (
          serviceNotAssigned
        ) : (
          <div className={styles.contentWrapper}>
            <h1 className={styles.heading}>Select Reason</h1>
            <div className={styles.cardsWrapper}>
              {serviceList.map(service => (
                <span className={styles.cardWrapper} key={service.value}>
                  <WidgetCard
                    title={service.label}
                    description={service.description}
                    selected={service.value === selectedServiceId}
                    onClick={() => this.selectReason(service.value)}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ entities, availabilities }) {
  const serviceList = entities
    .get('services')
    .get('models')
    .reduce(
      (acc, actual) => [
        ...acc,
        {
          label: actual.get('name'),
          value: actual.get('id'),
          description: actual.get('description'),
        },
      ],
      [],
    );
  return {
    selectedServiceId: availabilities.get('selectedServiceId'),
    serviceList,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hideButton,
      setAvailabilities,
      setNextAvailability,
      setSelectedServiceId,
    },
    dispatch,
  );
}

Reasons.propTypes = {
  hideButton: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  location: PropTypes.shape(locationShape).isRequired,
  selectedServiceId: PropTypes.string,
  serviceList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  setAvailabilities: PropTypes.func.isRequired,
  setNextAvailability: PropTypes.func.isRequired,
  setSelectedServiceId: PropTypes.func.isRequired,
};

Reasons.defaultProps = { selectedServiceId: '' };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reasons);
