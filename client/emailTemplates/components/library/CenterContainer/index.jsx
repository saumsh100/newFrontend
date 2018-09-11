
import React from 'react';
import PropTypes from 'prop-types';

export default function CenterContainer({ children, setFullHeight }) {
  const centerStyle = setFullHeight ? { height: '100%' } : {};

  return <center style={centerStyle}> {children}</center>;
}

CenterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  setFullHeight: PropTypes.bool,
};

CenterContainer.defaultProps = { setFullHeight: false };
