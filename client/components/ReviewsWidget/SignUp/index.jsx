
import React, { PropTypes } from 'react';
import { Link } from '../../library';

function SignUp(props) {
  return (
    <div>
      <h2>Signup</h2>
      <Link to="/login">
        <h3>Or Login</h3>
      </Link>
      <Link to="/submitted">
        <h3>Submit</h3>
      </Link>
    </div>
  );
}


SignUp.propTypes = {};

export default SignUp;
