
import React from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import PatientTooltip from './PatientTooltip';
import PreviewMessage from './PreviewMessage';
import { Button, Icon } from '../../../../library';
import styles from './styles.scss';

const DraftMessage = ({
  conversionAnalyzer,
  textMessage,
  setTextMessage,
  handleSendMessage,
  goToWaitlistTable,
}) => {
  const { success, errors } = conversionAnalyzer;
  const { 1200: noPhoneNumber = [], 2200: smsDisabled = [] } = groupBy(errors, 'errorCode');

  const handleChange = (e) => {
    setTextMessage(e.target.value);
  };

  return (
    <div className={styles.draftMessageContainer}>
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
          <PatientTooltip patients={success} suffix="will receive this message." />
        )}
        {noPhoneNumber.length > 0 && (
          <PatientTooltip patients={noPhoneNumber} suffix="with no phone number." />
        )}
        {smsDisabled.length > 0 && (
          <PatientTooltip patients={smsDisabled} suffix="has unsubscribed." />
        )}
      </div>
      <div className={styles.draftMessageWrapper}>
        <div className={styles.column}>
          <label htmlFor="textarea" className={styles.columnLabel}>
            Message
          </label>
          <div className={styles.columnBody}>
            <textarea
              id="textarea"
              className={styles.textArea}
              value={textMessage}
              onChange={handleChange}
            />
          </div>
          <div className={styles.legend}>*Please make sure to update the date and time</div>
        </div>
        <div className={styles.column}>
          <PreviewMessage message={textMessage} phoneNumber="123456789000" />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <Button onClick={goToWaitlistTable} border="blue">
            Cancel
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button onClick={handleSendMessage} color="blue">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

DraftMessage.propTypes = {
  textMessage: PropTypes.string.isRequired,
  conversionAnalyzer: PropTypes.shape({
    success: PropTypes.arrayOf(PropTypes.object),
    errors: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  setTextMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  goToWaitlistTable: PropTypes.func.isRequired,
};

export default DraftMessage;
