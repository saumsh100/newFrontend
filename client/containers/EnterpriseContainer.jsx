
import React from 'react';
import PropTypes from 'prop-types';

const EnterpriseContainer = ({ children }) => <div>{children}</div>;

EnterpriseContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EnterpriseContainer;
