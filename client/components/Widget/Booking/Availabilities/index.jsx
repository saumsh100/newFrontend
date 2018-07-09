
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Link } from '../../../library';
import MobileDayPicker from './MobileDayPicker';
import AvailabilitiesDisplay from './AvailabilitiesDisplay';
import Preferences from './Preferences';
import Footer from '../../Footer';
import styles from './styles.scss';

function Availabilities({ hasWaitList, selectedAvailability }) {
  const canGoNext = hasWaitList || selectedAvailability;
  const nextButtonClass = canGoNext ? styles.nextButton : styles.disabledButton;
  return (
    <div className={styles.availWrapper}>
      <div className={styles.mobileDayPickerContainer}>
        <MobileDayPicker />
      </div>
      <Preferences />
      <AvailabilitiesDisplay />
      {hasWaitList ? (
        <div className={styles.waitlistCta}>
          You will be notified when an earlier appointment is available. Want to change this? Edit
          the waitlist.
        </div>
      ) : (
        <div className={styles.waitlistCta}>
          Want to be notified if an earlier appointment becomes available? Join the waitlist.
        </div>
      )}
      <Footer>
        <div className={styles.buttonsContainer}>
          <Link to="./book/wait">
            <Button color="white" className={styles.invertedButton}>
              {hasWaitList ? 'Edit' : 'Join'} Waitlist
            </Button>
          </Link>
          <Link to={canGoNext ? './book/review' : './book'}>
            <Button className={nextButtonClass}>Next</Button>
          </Link>
        </div>
      </Footer>
    </div>
  );
}

function mapStateToProps({ availabilities }) {
  return {
    hasWaitList: availabilities.get('hasWaitList'),
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}

Availabilities.propTypes = {
  hasWaitList: PropTypes.bool.isRequired,
  selectedAvailability: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  null,
)(Availabilities);
