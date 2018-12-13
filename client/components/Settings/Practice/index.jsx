
import React from 'react';
import PropTypes from 'prop-types';
import AccountShape from '../../library/PropTypeShapes/accountShape';

const Practice = ({ children, activeAccount }) => (
  <div style={{ height: '100%' }}>
    {React.Children.map(children, child => React.cloneElement(child, { activeAccount }))}
  </div>
);
export default Practice;

Practice.propTypes = {
  children: PropTypes.element.isRequired,
  activeAccount: PropTypes.shape(AccountShape).isRequired,
};
