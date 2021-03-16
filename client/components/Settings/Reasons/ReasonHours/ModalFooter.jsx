import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../library';
import styles from '../../../library/ScheduleCalendar/modal.scss';
import ui from '../../../../styles/ui-kit.scss';

const ModalFooter = ({ hideModal, disableUpdate, updateReason }) => (
  <div className={styles.footer}>
    <Button className={ui.modal__cancel} onClick={hideModal}>
      Cancel
    </Button>
    <Button className={ui.modal__save} disabled={disableUpdate} onClick={updateReason}>
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
