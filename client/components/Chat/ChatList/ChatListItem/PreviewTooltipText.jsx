import React from 'react';
import PropTypes from 'prop-types';
import styles from './reskin-styles.scss';
import {getUTCDate} from '../../../library';

const getTooltipMessageTime = (message, timezone) =>
getUTCDate(message, timezone).calendar(null, {
  sameDay: '[Today], h:mm a',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday], h:mm a',
  lastWeek: 'dddd, MMM Do YYYY, h:mm a',
  sameElse: 'dddd, MMM Do YYYY, h:mm a',
});

export default function   PreviewTooltipText(props) {
  const { lastTextMessage,lastUserTextMessage, timezone, patient, chat} = props;

  const lastUserMessageDate = getUTCDate(
    lastUserTextMessage.createdAt || chat.updatedAt,
    timezone,
  );
    const mDate = getUTCDate(lastTextMessage.createdAt || chat.updatedAt, timezone);
    const user = lastTextMessage?.body !== '' ? lastTextMessage?.get('user') : '';
    const newUser = user?.size ? Object.fromEntries(user) : user;
    const lastUser = lastUserTextMessage?.userId ? lastUserTextMessage?.get('user') : '';
    const newlastUser = lastUser?.size ? Object.fromEntries(lastUser) : lastUser;
    const tooltipMessageDate = getTooltipMessageTime(mDate, timezone);
    const lastUserTooltipMessageDate = getTooltipMessageTime(lastUserMessageDate, timezone);
    const isFromPatient = lastTextMessage?.smsStatus === 'received';

    let avatarUser;
    if (lastTextMessage?.body) {
      avatarUser = !isFromPatient && newUser?.id ? newUser : newlastUser;
    }
    const finalTooltipMessageDate =
    user && user?.id ? tooltipMessageDate : lastUserTooltipMessageDate;

  return (
    <div className={styles.avatarTooltip}>
    {avatarUser && avatarUser.firstName && (
      <>
        <div className={styles.userName}>
          {avatarUser.firstName} {avatarUser.lastName}
        </div>
        <div className={styles.tooltipLastMessage}>
          <div>{avatarUser.firstName} last messaged <span className = {styles.tooltipLastMessage_patientName}>{patient.firstName}</span> at:</div>
          <div className = {styles.finalMessageDate}>{finalTooltipMessageDate}</div>
        </div>
      </>
    )}
  </div>
  );
}
PreviewTooltipText.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    lastTextMessageId: PropTypes.string,
    lastUserTextMessageId: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  lastTextMessage: PropTypes.shape({
    body: PropTypes.string,
    createdAt: PropTypes.string,
    smsStatus: PropTypes.string,
  }).isRequired,
  lastUserTextMessage: PropTypes.shape({
    body: PropTypes.string,
    createdAt: PropTypes.string,
    userId:  PropTypes.string,
  }).isRequired,
  patient: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
