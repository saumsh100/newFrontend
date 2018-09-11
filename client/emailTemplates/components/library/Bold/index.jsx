
import React from 'react';
import PropTypes from 'prop-types';

export default function Bold({ children }) {
  const style = {
    textDecoration: 'none',
    color: '#000000',
    fontFamily: 'Roboto, sans-serif, Arial',
    fontWeight: 500,
  };

  return <span style={style}>{children}</span>;
}

Bold.propTypes = { children: PropTypes.node.isRequired };
