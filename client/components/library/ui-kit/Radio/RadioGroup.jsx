
import React from 'react';
import PropTypes from 'prop-types';

const RadioGroup = ({ children, onChange, value }) => (
  <div>
    {React.Children.map(children, child =>
      React.cloneElement(child, { checked: child.props.value === value,
onChange }))}
  </div>
);

RadioGroup.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default RadioGroup;
