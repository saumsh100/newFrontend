
import React from 'react';
import PropTypes from 'prop-types';
import PatientTooltip from './PatientTooltip';
import PreviewMessage from './PreviewMessage';
import mockedWaitSpots from './mockedData';
import { Button, Icon } from '../../../../library';
import Patient from '../../../../../entities/models/Patient';
import { WAITLIST_STATE } from '../index';
import styles from './styles.scss';

const DraftMessage = ({
  waitSpots,
  toggleWaitlist,
  setWaitListState,
  textMessage,
  setTextMessage,
}) => {
  const patients = waitSpots.map(({ patient }) => patient);
  const patientsWithPhone = patients.filter(({ cellPhoneNumber }) => cellPhoneNumber);
  const patientsWithoutPhone = patients.filter(({ cellPhoneNumber }) => !cellPhoneNumber);

  const handleChange = (e) => {
    setTextMessage(e.target.value);
  };

  const handleSubmit = async () => {
    const accountId = 'acount_id';
    const waitspotIds = waitSpots.map(({ id }) => id);
    const reqBody = {
      accountId,
      waitspotIds,
      message: textMessage,
    };
    console.log('send request: ', reqBody);
    new Promise((resolve) => {
      setTimeout(resolve, 1000);
    }).then(() => {
      console.log('done');
      setWaitListState(WAITLIST_STATE.sent);
    });
  };

  const handleRedirect = () => {
    setWaitListState(WAITLIST_STATE.initial);
  };

  return (
    <div className={styles.draftMessageContainer}>
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
        <PatientTooltip patients={patientsWithPhone} />
        {!!patientsWithPhone.length && 'will receive this message.'}
        <PatientTooltip patients={patientsWithoutPhone} />
        {!!patientsWithoutPhone.length && 'with no phone number.'}
      </div>
      <div className={styles.draftMessageWrapper}>
        <div className={styles.column}>
          <label className={styles.columnLabel}>Message(Max 160 characters)</label>
          <div className={styles.columnBody}>
            <textarea
              className={styles.textArea}
              maxLength={160}
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
          <Button onClick={toggleWaitlist} border="blue">
            Cancel
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button onClick={handleSubmit} color="blue">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

DraftMessage.propTypes = {
  waitSpots: PropTypes.arrayOf(
    PropTypes.shape({
      clientId: PropTypes.string,
      id: PropTypes.string,
      accountViewerClientId: PropTypes.string,
      patient: PropTypes.instanceOf(Patient),
    }),
  ),
  toggleWaitlist: PropTypes.func.isRequired,
  setWaitListState: PropTypes.func.isRequired,
  textMessage: PropTypes.string.isRequired,
  setTextMessage: PropTypes.func.isRequired,
};

DraftMessage.defaultProps = {
  waitSpots: mockedWaitSpots,
};

export default DraftMessage;
