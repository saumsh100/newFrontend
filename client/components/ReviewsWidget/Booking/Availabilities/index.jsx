
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Link,
} from '../../../library';
import MobileDayPicker from './MobileDayPicker';
import AvailabilitiesDisplay from './AvailabilitiesDisplay';
import styles from './styles.scss';

export default class Availabilities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className={styles.mobileDayPickerContainer}>
          <MobileDayPicker />
        </div>
        <AvailabilitiesDisplay />
        <Link to="./book/wait">
          <Button>Join Waitlist</Button>
        </Link>
        <Link to="./book/review">
          <Button>Next</Button>
        </Link>
      </div>
    );
  }
}
