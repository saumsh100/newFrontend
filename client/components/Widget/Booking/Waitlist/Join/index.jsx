import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal } from '../../../../library';
import { Button } from '../../../components';
import { historyShape, locationShape } from '../../../../library/PropTypeShapes/routerShapes';
import { resetWaitlist } from '../../../../../reducers/availabilities';
import { hideButton } from '../../../../../reducers/widgetNavigation';
import styles from './styles.scss';

function Join({ history, location, toCloseModal, ...props }) {
  /**
   * Check if the route comes from edit mode.
   */
  const nextLoc = (location.state && location.state.nextRoute) || './patient-information';
  /**
   * If the user is negating his desire to join the waitlist,
   * reset the wailist information, so if he joined by mistake or
   * change his mind, he'll be able to not join the waitlist.
   *
   * @param {boolean} confirmWaitlist
   */
  const handleWaitlistConfirmation = (confirmWaitlist) => {
    if (!confirmWaitlist) {
      props.resetWaitlist();
    }
    return history.push({
      ...location,
      pathname: confirmWaitlist ? './waitlist/select-dates' : nextLoc,
    });
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
  location: PropTypes.shape(locationShape).isRequired,
  hideButton: PropTypes.func.isRequired,
  toCloseModal: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Join);
