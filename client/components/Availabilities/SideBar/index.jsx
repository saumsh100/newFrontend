
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
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

    return (
      <div className={styles.sideBarWrapper}>
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
  isCollapsed: false,
};

SideBar.propTypes = {
  account: PropTypes.object,
  isCollapsed: PropTypes.bool.isRequired,
};

function mapStateToProps({ availabilities, toolbar }) {
  return {
    selectedAvailability: availabilities.get('selectedAvailability'),
    isCollapsed: toolbar.get('isCollapsed'),
  };
}

export default connect(mapStateToProps, null)(SideBar);
