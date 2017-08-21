
import React, { PropTypes } from 'react';
import { Link } from '../../library';

function Review(props) {
  return (
    <div>
      <h2>Leave Review</h2>
      <Link to="/login">
        <h3>Login</h3>
      </Link>
    </div>
  );
}

Review.propTypes = {};

export default Review;
