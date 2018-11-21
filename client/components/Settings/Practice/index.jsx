
import React from 'react';
import PropTypes from 'prop-types';
import AccountShape from '../../library/PropTypeShapes/accountShape';

export default function Practice({ children, activeAccount }) {
  const divStyle = { height: '100%' };
  return (
    <div style={divStyle}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeAccount }))}
    </div>
  );
}

Practice.propTypes = {
  children: PropTypes.element,
  activeAccount: PropTypes.shape(AccountShape),
};
