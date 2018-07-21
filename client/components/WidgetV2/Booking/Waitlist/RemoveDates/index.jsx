
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal } from '../../../../library';
import { setWaitlistUnavailableDates } from '../../../../../actions/availabilities';
import { historyShape } from '../../../../library/PropTypeShapes/routerShapes';
import patientUserShape from '../../../../library/PropTypeShapes/patientUserShape';
import styles from './styles.scss';

function RemoveDates({
  history, isAuth, patientUser, ...props
}) {
  /**
   * Check if the user is logged, if it's send him to the patient-information route,
   * otherwise send him to the login
   */
  const linkTo =
    !isAuth || !patientUser || !patientUser.isPhoneNumberConfirmed
      ? {
        pathname: '../../login',
        state: {
          nextRoute: './book/patient-information',
        },
      }
      : '../patient-information';
  /**
   * If the user is negating his desire to join the waitlist,
   * reset the wailist information, so if he joined by mistake or
   * change his mind, he'll be able to not join the waitlist.
   *
   * @param {bool} confirmWaitlist
   */
  const handleUnavailableDaysConfirmation = (confirmWaitlist) => {
    if (!confirmWaitlist) {
      props.setWaitlistUnavailableDates([]);
    }
    return history.push(confirmWaitlist ? './days-unavailable' : linkTo);
  };

  return (
    <Modal active className={styles.customDialog} containerStyles={styles.modalContainerStyles}>
      <h3 className={styles.title}>Do you need to remove a specific date from your waitlist?</h3>
      <div className={styles.buttonsWrapper}>
        <Button
          onClick={() => handleUnavailableDaysConfirmation(true)}
          className={styles.confirmation}
        >
          Yes
        </Button>
        <Button
          onClick={() => handleUnavailableDaysConfirmation(false)}
          className={styles.negation}
        >
          No
        </Button>
      </div>
    </Modal>
  );
}

function mapStateToProps({ auth }) {
  return {
    isAuth: auth.get('isAuthenticated'),
    patientUser: auth.get('patientUser'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setWaitlistUnavailableDates,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RemoveDates);

RemoveDates.propTypes = {
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  patientUser: PropTypes.oneOfType([PropTypes.shape(patientUserShape), PropTypes.string])
    .isRequired,
  setWaitlistUnavailableDates: PropTypes.func.isRequired,
};
