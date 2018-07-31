
import React from 'react';
import PropTypes from 'prop-types';
import Star from '../Star';
import dateFormatter from '../../../../iso/helpers/dateTimezone/dateFormatter';
import styles from './styles.scss';

export default function ReviewEvent(props) {
  const { data, bodyStyle } = props;

  const stars = [];

  for (let i = 0; i < data.review.stars; i += 1) {
    stars.push(<Star size={1.8} />);
  }

  return (
    <div className={bodyStyle}>
      <div className={styles.body_header}>
        <div className={styles.review_stars}>{stars}</div>
        {data.firstName} left a review for the appointment on{' '}
        {dateFormatter(data.appointment.startDate, '', 'MMMM Do, YYYY h:mma')}
      </div>
      <div className={styles.body_subHeader}>{data.review.description}</div>
    </div>
  );
}

ReviewEvent.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string,
  }).isRequired,
  bodyStyle: PropTypes.string,
};

ReviewEvent.defaultProps = {
  bodyStyle: '',
};
