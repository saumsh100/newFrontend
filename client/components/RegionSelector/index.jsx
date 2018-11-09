
import React from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu, Icon, List, MenuItem } from '../library';
import styles from './styles.scss';

const ActiveRegion = ({ currentRegion: { label }, ...props }) => (
  <div {...props}>
    <div className={styles.iconContainer}>
      {label}
      <span>
        <Icon icon="caret-down" size={1.2} type="solid" />
      </span>
    </div>
  </div>
);

ActiveRegion.propTypes = {
  currentRegion: PropTypes.shape({ label: PropTypes.string }),
  onClick: PropTypes.func.isRequired,
};

ActiveRegion.defaultProps = { currentRegion: {} };

export default function RegionSelector({ options, selectRegion, currentRegion }) {
  const listItems = options.map(({ label, value }) => (
    <MenuItem key={value} onClick={() => selectRegion(value)}>
      {label}
    </MenuItem>
  ));

  return (
    <DropdownMenu
      upwards
      labelComponent={ActiveRegion}
      align="right"
      labelProps={{ currentRegion }}
      className={styles.menu}
    >
      <List>{listItems}</List>
    </DropdownMenu>
  );
}

const regionShape = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});

RegionSelector.propTypes = {
  options: PropTypes.arrayOf(regionShape),
  selectRegion: PropTypes.func.isRequired,
  currentRegion: regionShape.isRequired,
};

RegionSelector.defaultProps = { options: [] };
