import React from 'react';
import Proptypes from 'prop-types';

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: Proptypes.exact({
    name: Proptypes.string.isRequired,
    message: Proptypes.string.isRequired,
    stack: Proptypes.string,
  }).isRequired,
};

export default ErrorFallback;
