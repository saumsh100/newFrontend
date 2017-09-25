
import React, { PropTypes } from 'react';
import styles from './styles.scss';

function ReviewsWidget(props) {
  const {
    children,
  } = props;

  return (
    <div className={styles.reviewsWidgetContainer}>
      <div className={styles.reviewsWidgetCenter}>
        {children}
      </div>
    </div>
  );
}

ReviewsWidget.propTypes = {};

export default ReviewsWidget;

// ChIJmdp9t7VwhlQRailxK3m6p1g
// https://search.google.com/local/writereview?placeid=ChIJmdp9t7VwhlQRailxK3m6p1g

// https://www.google.com/search?q=Capitol+Hill+Dental+Clinic+-+Dr.+Wong,+4633+Hastings+St,+Burnaby,+BC+V5C+2K6,+Canada&ludocid=6388279626030983530#lrd=0x548670b5b77dda99:0x58a7ba792b71296a,3,5

