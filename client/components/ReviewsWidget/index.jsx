
import React, { PropTypes } from 'react';

function ReviewsWidget(props) {
  const {
    children,
  } = props;

  return (
    <div>
      <h1>Reviews Widget</h1>
      {children}
    </div>
  );
}

ReviewsWidget.propTypes = {};

export default ReviewsWidget;
