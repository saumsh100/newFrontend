
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
