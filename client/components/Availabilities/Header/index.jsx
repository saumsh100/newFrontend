
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  IconButton,
} from '../../library';
import * as WidgetActions from '../../../thunks/availabilities';
import styles from './styles.scss';

function Header({ closeBookingModal }) {
  return (
    <div className={styles.appointment__header}>
      <div className={styles.appointment__header_title}>
        BOOK APPOINTMENT
      </div>
      <IconButton
        icon="times"
        className={styles.iconButton}
        onClick={() => closeBookingModal()}
      />
    </div>
  );
}

Header.defaultProps = {
  bookingWidgetPrimaryColor: '#ff715a',
};

Header.propTypes = {
  closeBookingModal: PropTypes.func.isRequired,
};

function mapActionsToDispatch(dispatch) {
  return bindActionCreators({
    closeBookingModal: WidgetActions.closeBookingModal,
  }, dispatch);
}

export default connect(null, mapActionsToDispatch)(Header);
