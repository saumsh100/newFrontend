
import React, { PropTypes } from 'react';
import { Link } from '../../library';

function Login(props) {
  return (
    <div>
      <h2>Login</h2>
      <Link to="/signup">
        <h3>Or Signup</h3>
      </Link>
      <Link to="/submitted">
        <h3>Submit</h3>
      </Link>
    </div>
  );
}

Login.propTypes = {};

export default Login;
