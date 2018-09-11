
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Item, A } from 'react-html-email';

export default function Copyright({ styleObj, accountName }) {
  return (
    <Box width="100%" height="40px">
      <Item
        style={{
          textAlign: 'center',
          color: '#6c6c6c',
          fontSize: 12,
          textDecoration: 'none',
          ...styleObj,
        }}
        className="bottomDefaultText"
        data-mc-edit="copyright"
      >
        Copyright @ 2018 {accountName} | &nbsp;
        <A
          href="*|UNSUB|*"
          style={{
            textDecoration: 'none',
            color: '#6c6c6c',
          }}
        >
          Unsubscribe
        </A>
      </Item>
    </Box>
  );
}

Copyright.propTypes = {
  styleObj: PropTypes.objectOf(PropTypes.string),
  accountName: PropTypes.string.isRequired,
};

Copyright.defaultProps = { styleObj: {} };
