
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Link,
} from '../../../library';
import MobileDayPicker from './MobileDayPicker';
import AvailabilitiesDisplay from './AvailabilitiesDisplay';
import Preferences from './Preferences';
import styles from './styles.scss';

export default class Availabilities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.availWrapper}>
        <div className={styles.mobileDayPickerContainer}>
          <MobileDayPicker />
        </div>
        <Preferences />
        <AvailabilitiesDisplay />
        <div className={styles.waitlistCta}>
          Want to be notified if an earlier
          appointment becomes availabile? Join the wailist.
        </div>
        <div className={styles.footer}>
          <Link to="./book/wait">
            <Button
              color="white"
              className={styles.invertedButton}
            >
              Join Waitlist
            </Button>
          </Link>
          <Link to="./book/review">
            <Button
              disabled
            >
              Next
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
