import React, { PropTypes } from 'react';
import { Button } from '../../../library';

export default function EmailSuccess(props) {
  const {
    email,
    push,
  } = props;

  return (
    <div>
      <p>
        We've sent an email to <span>{email}</span> with password reset instructions.
      </p>
      <p>
        If the email doesn't show up soon, please check your spam folder. We sent the email from <span>noreply@carecru.com</span>.
      </p>
      {/*<Button
        onClick={()=> {
          // push('/login');
        }}
      >
        Return to Login
      </Button>*/}
    </div>
  )
}

EmailSuccess.propTypes = {
  // push: PropTypes.func.isRequired,
};
