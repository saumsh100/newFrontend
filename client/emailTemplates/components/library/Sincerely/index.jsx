
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Item } from 'react-html-email';
import CenterElement from '../CenterElement';
import SpaceTable from '../SpaceTable';

export default function Sincerely(props) {
  const { styleObj, accountName } = props;

  const style = {
    color: '#6c6c6c',
    fontSize: 14,
    textAlign: 'left',
    ...styleObj,
  };

  return (
    <CenterElement colWidth={450}>
      <SpaceTable height={40} />
      <Box width="100%" height="100%">
        <Item style={style} className="subHeader" data-mc-edit="sincerely">
          Sincerely,
        </Item>
        <Item style={style} className="subHeader" data-mc-edit="sincerely_name">
          {accountName}
        </Item>
      </Box>
      <SpaceTable height={50} />
    </CenterElement>
  );
}

Sincerely.propTypes = {
  styleObj: PropTypes.objectOf(PropTypes.string),
  accountName: PropTypes.string.isRequired,
};

Sincerely.defaultProps = { styleObj: {} };
