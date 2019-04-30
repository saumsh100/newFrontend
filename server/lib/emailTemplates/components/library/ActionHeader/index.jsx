
import React from 'react';
import PropTypes from 'prop-types';
import { Item, Box } from 'react-html-email';

export default function ActionHeader({ children, fontSize }) {
  const largeHeaderStyle = {
    textAlign: 'center',
    color: '#313131',
    fontSize: fontSize || 33,
    textDecoration: 'none',
    fontFamily: 'Roboto, sans-serif, Arial',
    fontWeight: 100,
  };

  return (
    <Box width="100%" height="100%">
      <Item
        style={largeHeaderStyle}
        className="largeHeader"
        data-mc-edit={`actionHeader_${Math.random()}`}
      >
        {children}
      </Item>
    </Box>
  );
}

ActionHeader.propTypes = {
  children: PropTypes.node.isRequired,
  fontSize: PropTypes.number,
};

ActionHeader.defaultProps = { fontSize: 33 };
