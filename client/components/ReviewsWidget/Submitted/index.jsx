
import React, { PropTypes } from 'react';
import { Link } from '../../library';

function Submitted(props) {
  return (
    <div>
      <h2>Submitted</h2>
      <Link to="/review">
        <h3>Back to Beginning</h3>
      </Link>
    </div>
  );
}

Submitted.propTypes = {};

export default Submitted;
