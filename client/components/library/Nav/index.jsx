
import React from 'react';
import RSNav from 'reactstrap/lib/Nav';
import RSNavItem from 'reactstrap/lib/NavItem';
import RSNavLink from 'reactstrap/lib/NavLink';
import RSNavbar from 'reactstrap/lib/Navbar';
import RSNavbarBrand from 'reactstrap/lib/NavbarBrand';

export function Nav(props) {
  return <RSNav {...props} />;
}

export function NavItem(props) {
  return <RSNavItem {...props} />;
}

export function NavLink(props) {
  return <RSNavLink {...props} />;
}

export function Navbar(props) {
  return <RSNavbar {...props} />;
}

export function NavbarBrand(props) {
  return <RSNavbarBrand {...props} />;
}
