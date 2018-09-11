
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Item } from 'react-html-email';

export default function Address({ children }) {
  const style = {
    color: '#6c6c6c',
    textAlign: 'center',
    fontSize: '12px',
    textDecoration: 'none',
  };

  return (
    <Box width="100%">
      <Item style={style} className="bottomDefaultText" data-mc-edit={`address_${Math.random()}`}>
        {children}
      </Item>
    </Box>
  );
}

Address.propTypes = { children: PropTypes.node.isRequired };
