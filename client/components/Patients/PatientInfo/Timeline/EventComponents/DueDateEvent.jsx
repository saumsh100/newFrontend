
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classnames from 'classnames';
import { dateFormatter } from '@carecru/isomorphic';
import EventContainer from './Shared/EventContainer';
import getEventText from './Shared/textBuilder';
import styles from './styles.scss';

const calcDotStyling = (date) => {
  const hygieneDueDate = moment(date);

  const monthsDiff = moment().diff(hygieneDueDate, 'months');
  const weeksDiff = moment().diff(hygieneDueDate, 'weeks');
  let dotStyle = styles.dot;
  let upcomingDueDate = false;

  if (monthsDiff >= 8) {
    dotStyle = classnames(dotStyle, styles.dotRed);
  } else if (monthsDiff >= 0 && monthsDiff < 8 && weeksDiff > 0) {
    dotStyle = classnames(dotStyle, styles.dotYellow);
  } else if (weeksDiff === 0 || (weeksDiff <= -1 && weeksDiff >= -4)) {
    dotStyle = classnames(dotStyle, styles.dotGreen);
    upcomingDueDate = true;
  } else if (weeksDiff <= -4) {
    upcomingDueDate = true;
    dotStyle = styles.dot;
  }

  return {
    dotStyle,
    upcomingDueDate,
  };
};

export default function DueDateEvent({ data }) {
  const { dotStyle, upcomingDueDate } = calcDotStyling(data.dueDate);

  const dueDateText = upcomingDueDate ? 'upcoming' : 'pastDue';
  const tense = upcomingDueDate ? 'futureTense' : 'pastTense';

  const dateTypeText = data.dateType === 'same' ? 'hygiene and recall' : data.dateType;
  const upcomingDateText = dateFormatter(data.dueDate, '', 'MMMM Do, YYYY');

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
    createdAt: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};
