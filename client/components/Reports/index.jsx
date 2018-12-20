
import React from 'react';
import PropTypes from 'prop-types';

export default function ReportsContainer(props) {
  return <div>{props.children}</div>;
}

ReportsContainer.propTypes = { children: PropTypes.element.isRequired };
