import React from 'react';
import PropTypes from 'prop-types';
import { StandardButton as Button } from '../../../library';
import styles from '../../../library/ScheduleCalendar/modal.scss';

const ModalFooter = ({ hideModal, disableUpdate, updateReason }) => (
  <div className={styles.footer}>
    <Button className={styles.cancelButton} onClick={hideModal} variant="secondary">
      Cancel
    </Button>
    <Button disabled={disableUpdate} onClick={updateReason}>
      Update
    </Button>
  </div>
);

ModalFooter.propTypes = {
  disableUpdate: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  updateReason: PropTypes.func.isRequired,
};

export default ModalFooter;
