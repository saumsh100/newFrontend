
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button } from '../../../../library';
import { historyShape } from '../../../../library/PropTypeShapes/routerShapes';
import { resetWaitlist } from '../../../../../actions/availabilities';
import { hideButton } from '../../../../../reducers/widgetNavigation';
import styles from './styles.scss';

function Join({
  isAuth, history, toCloseModal, ...props
}) {
  /**
   * Check if the user is logged, if it's send him to the patient-information route,
   * otherwise send him to the login
   */
  const linkTo = isAuth ? './patient-information' : '../login';

  /**
   * If the user is negating his desire to join the waitlist,
   * reset the wailist information, so if he joined by mistake or
   * change his mind, he'll be able to not join the waitlist.
   *
   * @param {boolean} confirmWaitlist
   */
  const handleWaitlistConfirmation = (confirmWaitlist) => {
    props.hideButton();
    if (!confirmWaitlist) {
      props.resetWaitlist();
    }
    return history.push(confirmWaitlist ? './waitlist/select-dates' : linkTo);
  };

  return (
    <Modal
      active
      onOverlayClick={toCloseModal}
      onEscKeyDown={toCloseModal}
      className={styles.customDialog}
      containerStyles={styles.modalContainerStyles}
    >
      <h3 className={styles.title}>
        Join our waitlist and be notified if an earlier appointment becomes available?
      </h3>
      <div className={styles.buttonsWrapper}>
        <Button onClick={() => handleWaitlistConfirmation(true)} className={styles.confirmation}>
          Yes, join waitlist
        </Button>
        <Button onClick={() => handleWaitlistConfirmation(false)} className={styles.negation}>
          No, thanks!
        </Button>
      </div>
    </Modal>
  );
}

function mapStateToProps({ auth }) {
  return {
    isAuth: auth.get('isAuthenticated'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      resetWaitlist,
      hideButton,
    },
    dispatch,
  );
}

Join.propTypes = {
  resetWaitlist: PropTypes.func.isRequired,
  history: PropTypes.shape(historyShape).isRequired,
  isAuth: PropTypes.bool.isRequired,
  hideButton: PropTypes.func.isRequired,
  toCloseModal: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Join);
