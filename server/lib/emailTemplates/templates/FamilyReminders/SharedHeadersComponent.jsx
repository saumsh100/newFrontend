
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Item } from 'react-html-email';
import {
  ActionContainer,
  ActionHeader,
  SubHeaderContainer,
  SubHeader,
  SpaceTable,
} from '../../components/library';

export default function SharedHeadersComponent({ actionHeader, subHeader }) {
  return (
    <Box width="100%">
      <Item>
        <ActionContainer>
          <ActionHeader>{actionHeader}</ActionHeader>
        </ActionContainer>

        <SubHeaderContainer>
          <SubHeader>{subHeader}</SubHeader>
          <SpaceTable height={30} />
        </SubHeaderContainer>
      </Item>
    </Box>
  );
}

SharedHeadersComponent.propTypes = {
  actionHeader: PropTypes.string.isRequired,
  subHeader: PropTypes.string.isRequired,
};
