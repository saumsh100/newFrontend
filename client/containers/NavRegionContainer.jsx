import PropTypes from 'prop-types';
import React from 'react';
import NavRegion from '../components/NavRegion';

function NavRegionContainer({ children, className, setIsSidebarHovered }) {
  return (
    <NavRegion className={className} setIsSidebarHovered={setIsSidebarHovered}>
      {children}
    </NavRegion>
  );
}

NavRegionContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
  setIsSidebarHovered: PropTypes.func.isRequired,
};

export default NavRegionContainer;
