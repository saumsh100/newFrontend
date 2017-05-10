
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  IconButton,
} from '../../library';
import * as WidgetActions from '../../../actions/availabilities';
import * as WidgetThunks from '../../../thunks/availabilities';
import styles from './styles.scss';

function Header(props) {
  const {
    registrationStep,
    setRegistrationStep,
    closeBookingModal,
    isConfirming,
    isSuccessfulBooking,
  } = props;

  let goBackButton = <div className={styles.spacer} />;
  if (registrationStep === 2 && !isSuccessfulBooking) {
    goBackButton = (
      <IconButton
        icon="arrow-left"
        className={styles.iconButton}
        onClick={() => setRegistrationStep(1)}
      />
    );
  }

  let headerText = 'SELECT AVAILABILITY';
  if (registrationStep === 2) {
    headerText = 'SIGN UP AND BOOK';
    if (isConfirming) {
      headerText = 'CONFIRM AND BOOK';
    }

    if (isSuccessfulBooking) {
      headerText = 'SUCCESS';
    }
  }

  return (
    <div className={styles.appointment__header}>
      {goBackButton}
      <div className={styles.appointment__header_title}>
        {headerText}
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
  setRegistrationStep: PropTypes.func.isRequired,
  registrationStep: PropTypes.number.isRequired,
  isConfirming: PropTypes.bool.isRequired,
  isSuccessfulBooking: PropTypes.bool.isRequired,
};

function mapStateToProps({ availabilities }) {
  return {
    registrationStep: availabilities.get('registrationStep'),
    isConfirming: availabilities.get('isConfirming'),
    isSuccessfulBooking: availabilities.get('isSuccessfulBooking'),
  };
}

function mapActionsToDispatch(dispatch) {
  return bindActionCreators({
    closeBookingModal: WidgetThunks.closeBookingModal,
    setRegistrationStep: WidgetActions.setRegistrationStepAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapActionsToDispatch)(Header);
