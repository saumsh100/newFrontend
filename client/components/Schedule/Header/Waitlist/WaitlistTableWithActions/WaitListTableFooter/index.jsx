import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Icon } from '../../../../../library';
import footerStyles from './footerStyles.scss';

const WaitListTableFooter = ({ waitlistCount, goToSendMassMessage, removeMultipleWaitSpots }) => {
  const isHidden = waitlistCount === 0 ? footerStyles.waitListTableFooterWrapper_Hidden : '';
  return (
    <div className={classNames(footerStyles.waitListTableFooterWrapper, isHidden)}>
      <Button className={footerStyles.removeButton} onClick={removeMultipleWaitSpots}>
        <Icon icon="trash" className={footerStyles.trashButton} />
        Remove from Waitlist
      </Button>
      <button type="button" className={footerStyles.sendButton} onClick={goToSendMassMessage}>
        Send Text to {waitlistCount} Patient
      </button>
    </div>
  );
};

WaitListTableFooter.propTypes = {
  waitlistCount: PropTypes.number.isRequired,
  goToSendMassMessage: PropTypes.func.isRequired,
  removeMultipleWaitSpots: PropTypes.func.isRequired,
};

export default WaitListTableFooter;
