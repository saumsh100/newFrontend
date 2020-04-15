
import React from 'react';
import PropTypes from 'prop-types';
import PreviewMessage from './PreviewMessage';
import Patient from '../../../../../entities/models/Patient';
import PatientTooltip from './PatientTooltip';
import { mockResponse } from './mockedData';
import { Button, Icon } from '../../../../library';
import { WAITLIST_STATE } from '../index';
import styles from './styles.scss';

const ResponseMessage = ({ response, setWaitListState, textMessage }) => {
  const { success, errors } = response;

  const handleRedirect = () => {
    setWaitListState(WAITLIST_STATE.initial);
  };

  return (
    <div className={styles.responseMessageContainer}>
      <div>
        <div
          className={styles.redirect}
          onClick={handleRedirect}
          role="button"
          tabIndex={0}
          onKeyUp={e => e.keyCode === 13 && handleRedirect}
        >
          <div className={styles.iconWrapper}>
            <Icon size={1} icon="chevron-left" />
          </div>
          Cancel and return to waitlist
        </div>
      </div>
      <div className={styles.heading}>
        {!!success.length && 'Message successfully sent to '}
        <PatientTooltip patients={success} />
        {!!success.length && '.'} {!!errors.length && 'Failed to send for '}
        <PatientTooltip patients={errors} /> {!!errors.length && '(missing phone number).'}
      </div>
      <div className={styles.responsePreviewWrapper}>
        <PreviewMessage message={textMessage} phoneNumber="123456789000" />
      </div>
      <div className={styles.footer}>
        <div className={styles.buttonWrapper}>
          <Button onClick={handleRedirect} color="blue">
            Return to Waitlist
          </Button>
        </div>
      </div>
    </div>
  );
};

ResponseMessage.propTypes = {
  response: {
    success: PropTypes.arrayOf(PropTypes.instanceOf(Patient)),
    errors: PropTypes.arrayOf(PropTypes.instanceOf(Patient)),
  },
  setWaitListState: PropTypes.func.isRequired,
  textMessage: PropTypes.string.isRequired,
};

ResponseMessage.defaultProps = {
  response: mockResponse,
};

export default ResponseMessage;
