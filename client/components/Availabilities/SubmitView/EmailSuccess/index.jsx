import React, { PropTypes } from 'react';
import { Button } from '../../../library';

export default function EmailSuccess(props) {
  const {
    email,
    push,
    className,
  } = props;

  return (
    <div className={className}>
      <p>
        We've sent an email to <b>{email}</b> with password reset instructions.
      </p>
      <p>
        If the email doesn't show up soon, please check your spam folder. We sent the email from <b>noreply@carecru.com</b>.
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
