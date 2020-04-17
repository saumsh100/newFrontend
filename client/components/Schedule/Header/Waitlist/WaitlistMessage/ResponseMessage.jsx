
import React from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import PreviewMessage from './PreviewMessage';
import PatientTooltip from './PatientTooltip';
import { Button, Icon } from '../../../../library';
import styles from './styles.scss';

const ResponseMessage = ({ sentMessages, goToWaitlistTable, textMessage }) => {
  const { success, errors } = sentMessages;
  const { 1200: noPhoneNumber = [], 2200: smsDisabled = [] } = groupBy(errors, 'errorCode');

  return (
    <div className={styles.responseMessageContainer}>
      <div>
        <div
          className={styles.redirect}
          onClick={goToWaitlistTable}
          role="button"
          tabIndex={0}
          onKeyUp={e => e.keyCode === 13 && goToWaitlistTable}
        >
          <div className={styles.iconWrapper}>
            <Icon size={1} icon="chevron-left" />
          </div>
          Cancel and return to waitlist
        </div>
      </div>
      <div className={styles.heading}>
        {success.length > 0 && (
          <span>
            Message successfully sent to <PatientTooltip patients={success} suffix="." />
          </span>
        )}
        {noPhoneNumber.length > 0 && (
          <span>
            Did not send to{' '}
            <PatientTooltip patients={noPhoneNumber} suffix="(missing phone number)." />
          </span>
        )}
        {smsDisabled.length > 0 && (
          <span>
            Did not send to <PatientTooltip patients={smsDisabled} suffix="(has unsubscribed)." />
          </span>
        )}
      </div>
      <div className={styles.responsePreviewWrapper}>
        <PreviewMessage message={textMessage} phoneNumber="123456789000" />
      </div>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <Button onClick={goToWaitlistTable} color="blue">
            Return to Waitlist
          </Button>
        </div>
      </div>
    </div>
  );
};

ResponseMessage.propTypes = {
  sentMessages: PropTypes.shape({
    success: PropTypes.arrayOf(PropTypes.object),
    errors: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  goToWaitlistTable: PropTypes.func.isRequired,
  textMessage: PropTypes.string.isRequired,
};

export default ResponseMessage;
