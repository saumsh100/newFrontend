
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Link,
} from '../../../library';
import MobileDayPicker from './MobileDayPicker';
import AvailabilitiesDisplay from './AvailabilitiesDisplay';
import Preferences from './Preferences';
import Footer from '../../Footer';
import styles from './styles.scss';

class Availabilities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasWaitList, selectedAvailability } = this.props;
    const canGoNext = hasWaitList || selectedAvailability;
    const nextButtonClass = canGoNext ?
      styles.nextButton :
      styles.disabledButton;

    return (
      <div className={styles.availWrapper}>
        <div className={styles.mobileDayPickerContainer}>
          <MobileDayPicker />
        </div>
        <Preferences />
        <AvailabilitiesDisplay />
        {hasWaitList ?
          <div className={styles.waitlistCta}>
            You will be notified when an earlier appointment is available.
            Want to change this? Edit the waitlist.
          </div> :
          <div className={styles.waitlistCta}>
            Want to be notified if an earlier
            appointment becomes availabile? Join the wailist.
          </div>}
        <Footer>
          <div className={styles.buttonsContainer}>
            <Link to="./book/wait">
              <Button
                color="white"
                className={styles.invertedButton}
              >
                {hasWaitList ? 'Edit' : 'Join'} Waitlist
              </Button>
            </Link>
            <Link to={canGoNext ? './book/review' : './book'}>
              <Button
                className={nextButtonClass}
              >
                Next
              </Button>
            </Link>
          </div>
        </Footer>
      </div>
    );
  }
}

function mapStateToProps({ availabilities,  }) {
  return {
    hasWaitList: availabilities.get('hasWaitList'),
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}

export default connect(mapStateToProps, null)(Availabilities);
