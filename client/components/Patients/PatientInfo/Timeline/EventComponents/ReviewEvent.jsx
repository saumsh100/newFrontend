
import React from 'react';
import PropTypes from 'prop-types';
import { getFormattedDate, Star } from '../../../../library';
import EventContainer from './Shared/EventContainer';
import getEventText from './Shared/textBuilder';
import styles from './styles.scss';

export default function ReviewEvent({ data, timezone }) {
  const stars = [];

  for (let i = 0; i < data.review.stars; i += 1) {
    stars.push(<Star size={1.8} />);
  }

  const apptDate = getFormattedDate(data.appointment.startDate, 'MMMM Do, YYYY h:mma', timezone);

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
  data: PropTypes.shape({
    review: PropTypes.shape({
      description: PropTypes.string,
      stars: PropTypes.number,
    }),
    appointment: PropTypes.shape({
      startDate: PropTypes.string,
    }),
    id: PropTypes.string,
    firstName: PropTypes.string,
    isCompleted: PropTypes.bool,
  }).isRequired,
  timezone: PropTypes.string.isRequired,
};
