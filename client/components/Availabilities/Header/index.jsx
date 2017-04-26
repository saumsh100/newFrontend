
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  IconButton,
} from '../../library';
import * as WidgetActions from '../../../actions/availabilities';
import * as WidgetThunks from '../../../thunks/availabilities';
import styles from './styles.scss';

function Header({ registrationStep, setRegistrationStep, closeBookingModal }) {
  let goBackButton = null;
  if (registrationStep === 2) {
    goBackButton = (
      <Button
        flat
        icon="arrow-left"
        className={styles.goBackButton}
        onClick={() => setRegistrationStep(1)}
      >
        Go Back
      </Button>
    );
  }

  return (
    <div className={styles.appointment__header}>
      {goBackButton}
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
  setRegistrationStep: PropTypes.func.isRequired,
  registrationStep: PropTypes.number.isRequired,
};

function mapStateToProps({ availabilities }) {
  return {
    registrationStep: availabilities.get('registrationStep'),
  };
}

function mapActionsToDispatch(dispatch) {
  return bindActionCreators({
    closeBookingModal: WidgetThunks.closeBookingModal,
    setRegistrationStep: WidgetActions.setRegistrationStepAction,
  }, dispatch);
}

export default connect(mapStateToProps, mapActionsToDispatch)(Header);
