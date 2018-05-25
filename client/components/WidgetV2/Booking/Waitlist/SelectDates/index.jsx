
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Link, DayPickerRange } from '../../../../library';
import Service from '../../../../../entities/models/Service';
import styles from './styles.scss';
import { historyShape } from '../../../../library/PropTypeShapes/routerShapes';

function SelectDates({ selectedService, history }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>Waitlist Summary</h3>
        <p className={styles.subtitle}>
          Here are the informations that you already defined to your appointment.
        </p>
        <p className={styles.waitlistIndex}>
          <span className={styles.waitlistKey}>Reason</span>
          <span className={styles.waitlistValue}>
            {selectedService.get('name')}
            <Link to={'../reason'} className={styles.editLink}>
              <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9.5V12h2.5l7.372-7.372-2.5-2.5L0 9.5zm11.805-6.805c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22z" />
              </svg>
            </Link>
          </span>
        </p>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Select Dates</h3>
        <p className={styles.subtitle}>
          Select the first and last day of your availability. You will be able to customize your
          schedule later.
        </p>
        <DayPickerRange onChange={() => console.log()} maxDays={60} />
        <Button
          // disabled={!waitlist.times.length}
          className={styles.fullWidthButton}
          onClick={() => history.push('./select-times')}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function mapStateToProps({ availabilities, entities }) {
  return {
    selectedService: entities.getIn([
      'services',
      'models',
      availabilities.get('selectedServiceId'),
    ]),
  };
}

export default connect(mapStateToProps, null)(SelectDates);

SelectDates.propTypes = {
  history: PropTypes.shape(historyShape),
  selectedService: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Service)]),
};
