
import React, { PropTypes } from 'react';

export default function App({ location, children }) {
  return (
    <div>
      <h1>CareCru</h1>
      <div>
        {children}
      </div>
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object,
};
