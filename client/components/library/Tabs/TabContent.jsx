import PropTypes from 'prop-types';
import React from 'react';

const TabContent = ({ children, className }) => {
  return (
    // Order is important, classNames={classes} needs to override props.className
    <div className={className}>{children}</div>
  );
};

TabContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

TabContent.defaultProps = {
  className: '',
};

export default TabContent;
