
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import 'moment-timezone';
import { Button } from '../../library';
import * as Actions from '../../../actions/availabilities';
import styles from './styles.scss';

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      isCollapsed,
      account,
      selectedAvailability,
      registrationStep,
      setRegistrationStep,
      // selectedWaitlist,
    } = this.props;

    const {
      name,
      street,
      state,
      city,
      fullLogoUrl,
      timezone,
    } = account.toJS();

    let selectedAvailabilityComponent = null;
    if (selectedAvailability) {
      const { startDate } = selectedAvailability;
      selectedAvailabilityComponent = (
        <div className={styles.sidebar__information}>
          {/* TODO: selectedAvailability needs it's own display */}
          <div className={styles.sidebar__information_title}>
            YOUR APPOINTMENT
          </div>
          <br />
          <div className={styles.sidebar__information_text}>
            {moment.tz(startDate, timezone).format('dddd, MMMM Do YYYY')}
          </div>
          <div className={styles.sidebar__information_text}>
            {moment.tz(startDate, timezone).format('h:mm a')}
          </div>
        </div>
      );
    }


    /*let goBackButton = null;
    if (registrationStep === 2) {
      goBackButton = (
        <Button
          icon="arrow-left"
          onClick={() => setRegistrationStep(1)}
        >
          Go Back
        </Button>
      );
    }*/

    const displayLogo = (fullLogoUrl ? (<div className={styles.sidebar__header}>
      <img className={styles.sidebar__header_logo} src={fullLogoUrl.replace('[size]', 'original')} alt="logo" />
    </div>) : null);

    return (
      <div className={styles.sideBarWrapper}>
        {displayLogo}
        <div className={styles.sidebar__body}>
          <div className={styles.sidebar__body_information}>
            <div className={styles.sidebar__information}>
              <div className={styles.sidebar__information_title}>
                {name}
              </div>
              <div className={styles.sidebar__information_text}>
                {street}
              </div>
              <div className={styles.sidebar__information_text}>
                {city}, {state}
              </div>
            </div>
          </div>
          <div className={styles.sidebar__body_information}>
            {selectedAvailabilityComponent}
          </div>
          {/*goBackButton*/}
        </div>
        <div className={styles.sidebar__footer}>
          <div className={styles.sidebar__footer_copy}>
            <div>Powered by</div>
            <img src="/images/logo_black.png" alt="logo" />
          </div>
        </div>
      </div>
    );
  }
}

SideBar.defaultProps = {

};

SideBar.propTypes = {
  // account: PropTypes.object,
  selectedAvailability: PropTypes.object,
  registrationStep: PropTypes.number.isRequired,
};

function mapStateToProps({ availabilities }) {
  return {
    account: availabilities.get('account'),
    selectedAvailability: availabilities.get('selectedAvailability'),
    registrationStep: availabilities.get('registrationStep'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setRegistrationStep: Actions.setRegistrationStepAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
