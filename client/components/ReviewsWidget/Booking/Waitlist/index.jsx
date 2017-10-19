
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  Link,
} from '../../../library';
import Footer from '../../Footer';
import WaitlistPreferences from './WaitlistPreferences';
import { setHasWaitList, updateWaitSpot } from '../../../../actions/availabilities';
import styles from './styles.scss';

class Waitlist extends Component {
  constructor(props) {
    super(props);

    this.joinWaitlist = this.joinWaitlist.bind(this);
    this.removeWaitlist = this.removeWaitlist.bind(this);
  }

  joinWaitlist() {
    this.props.setHasWaitList(true);
    this.props.history.push('../book');
  }

  removeWaitlist() {
    // Same as initial availabilities state
    this.props.updateWaitSpot({
      preferences: {
        mornings: true,
        afternoons: true,
        evenings: true,
        weekdays: true,
        weekends: true,
      },

      daysOfTheWeek: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      },

      unavailableDays: [],
    });

    this.props.setHasWaitList(false);
    this.props.history.push('../book');
  }

  render() {
    const { hasWaitList } = this.props;

    return (
      <div className={styles.wrapper}>
        <WaitlistPreferences />
        <div className={styles.waitlistInfo}>
          You'll be notified when an earlier time becomes available.
          {hasWaitList ? ' Do you want to be removed from the waitlist? Remove yourself below.' : null}
        </div>
        {hasWaitList ?
          <div className={styles.buttonWrapperRemove}>
            <Button
              className={styles.removeButton}
              onClick={this.removeWaitlist}
            >
              Remove Me
            </Button>
            <Button
              className={styles.saveButton}
              onClick={this.joinWaitlist}
            >
              Save Waitlist
            </Button>
          </div> :
          <div className={styles.buttonWrapper}>
            <Button
              className={styles.joinButton}
              onClick={this.joinWaitlist}
            >
              Join Waitlist
            </Button>
          </div>}
      </div>
    );
  }
}

function mapStateToProps({ availabilities }) {
  return {
    hasWaitList: availabilities.get('hasWaitList'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setHasWaitList,
    updateWaitSpot,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Waitlist));
