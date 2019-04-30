
import React from 'react';
import PropTypes from 'prop-types';
import CenterElement from '../CenterElement';
import SpaceTable from '../SpaceTable';

export default function ButtonContainer(props) {
  const { children, width } = props;

  return (
    <CenterElement colWidth={width}>
      <SpaceTable height={50} />
      {children}
      <SpaceTable height={30} />
    </CenterElement>
  );
}

ButtonContainer.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number,
};

ButtonContainer.defaultProps = { width: 300 };
