
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      collapsed,
      account,
      selectedAvailability,
      // selectedWaitlist,
    } = this.props;

    let selectedAvailabilityComponent = null;
    if (selectedAvailability) {
      const {
        startDate,
        endDate,
      } = selectedAvailability;

      selectedAvailabilityComponent = (
        <div className={styles.sidebar__information}>
          {/* TODO: selectedAvailability needs it's own display */}
          <div className={styles.sidebar__information_title}>
            YOUR APPOINTMENT
          </div>
          <div className={styles.sidebar__information_text}>
            8:30 AM
          </div>
        </div>
      );
    }

    // TODO: add real account data to this!
    // - address
    // - name
    // - logo
    const {
      name,
      address,
      state,
      city,
      logo,
    } = account.toJS();

    // TODO: process image to set size

    return (
      <div className={`${styles.signup__sidebar} ${collapsed ? styles.signup__sidebarActive : ''}`}>
        <div className={styles.sidebar__header}>
          <img className={styles.sidebar__header_logo} src={logo} alt="logo" />
        </div>
        <div className={styles.sidebar__body}>
          <div className={styles.sidebar__body_information}>
            <div className={styles.sidebar__information}>
              <div className={styles.sidebar__information_title}>
                {name}
              </div>
              <div className={styles.sidebar__information_text}>
                {address}
              </div>
              <div className={styles.sidebar__information_text}>
                {city}, {state}
              </div>
            </div>
          </div>
          <div className={styles.sidebar__body_information}>
            {selectedAvailabilityComponent}
          </div>
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
  collapsed: PropTypes.bool.isRequired,
  account: PropTypes.object,
};

function mapStateToProps({ availabilities }) {
  return {
    selectedAvailability: availabilities.get('selectedAvailability'),
  };
}

export default connect(mapStateToProps, null)(SideBar);
