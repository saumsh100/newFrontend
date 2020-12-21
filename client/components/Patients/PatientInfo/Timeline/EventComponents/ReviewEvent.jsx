
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter } from '@carecru/isomorphic';
import { Star } from '../../../../library';
import EventContainer from './Shared/EventContainer';
import getEventText from './Shared/textBuilder';
import styles from './styles.scss';

export default function ReviewEvent({ data, timezone }) {
  const stars = [];

  for (let i = 0; i < data.review.stars; i += 1) {
    stars.push(<Star size={1.8} />);
  }

  const apptDate = dateFormatter(data.appointment.startDate, timezone, 'MMMM Do, YYYY h:mma');

  const completedContent = (
    <div className={styles.review}>
      <div className={styles.review_stars}>{stars}</div>
      {data.firstName} {getEventText('english', 'reviews', 'completed')} {apptDate}{' '}
    </div>
  );

  const inCompleteContent = (
    <div className={styles.review}>
      {getEventText('english', 'reviews', 'incomplete')} {apptDate}
    </div>
  );

  const content = data.isCompleted ? completedContent : inCompleteContent;

  const headerData = <div className={styles.review}>{content}</div>;

  return (
    <EventContainer key={data.id} headerData={headerData} subHeaderData={data.review.description} />
  );
}

ReviewEvent.propTypes = {
  data: PropTypes.shape({ description: PropTypes.string }).isRequired,
  timezone: PropTypes.string.isRequired,
};
