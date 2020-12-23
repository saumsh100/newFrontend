
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import EventContainer from './Shared/EventContainer';
import getEventText from './Shared/textBuilder';
import styles from './styles.scss';
import { getUTCDate, getTodaysDate, getFormattedDate } from '../../../../library';

const calcDotStyling = (date, timezone) => {
  const hygieneDueDate = getUTCDate(date, timezone);
  const monthsDiff = getTodaysDate(timezone)
    .startOf('day')
    .diff(hygieneDueDate, 'months', true);

  let dotStyle = styles.dot;
  let upcomingDueDate = false;
  if (monthsDiff >= 18) {
    dotStyle = classnames(dotStyle, styles.dotGrey);
  } else if (monthsDiff >= 8 && monthsDiff < 18) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (monthsDiff >= 0 && monthsDiff < 8) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (monthsDiff >= -2 && monthsDiff < 0) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
    upcomingDueDate = true;
  }

  return {
    dotStyle,
    upcomingDueDate,
  };
};

export default function DueDateEvent({ data, timezone }) {
  const { dotStyle, upcomingDueDate } = calcDotStyling(data.dueDate, timezone);

  const dueDateText = upcomingDueDate ? 'upcoming' : 'pastDue';
  const tense = upcomingDueDate ? 'futureTense' : 'pastTense';

  const dateTypeText = data.dateType === 'same' ? 'hygiene and recall' : data.dateType;
  const upcomingDateText = getFormattedDate(data.dueDate, 'MMMM Do, YYYY', timezone);

  const headerText = `${data.firstName} ${getEventText(
    'english',
    'dueDate',
    dueDateText,
  )} ${dateTypeText}
  ${getEventText('english', 'dueDate', tense)} ${upcomingDateText}.`;

  const headerDiv = <div className={styles.body_header}>{headerText}</div>;

  const component = (
    <div className={styles.dueDate}>
      <div className={dotStyle}>&nbsp;</div>
      {headerDiv}
    </div>
  );

  return <EventContainer key={data.id} component={component} />;
}

DueDateEvent.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dueDate: PropTypes.string,
    dateType: PropTypes.string,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
