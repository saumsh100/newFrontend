import React from 'react';
import PropTypes from 'prop-types';
import DropdownSelect from '../ui-kit/DropdownSelect';
import styles from './styles.scss';

const NavDropdownList = props => <DropdownSelect {...props} wrapperClass={styles.wrapperStyle} />;

NavDropdownList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string,
};

NavDropdownList.defaultProps = {
  options: [],
  selected: null,
};

export default NavDropdownList;
